using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;
using PlacaSegura.Domain.ValueObjects;

namespace PlacaSegura.Application.Services;

public class AuthService : IAuthService
{
    private readonly IPlacaSeguraDbContext _context;
    private readonly IOtpService _otpService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IPlacaSeguraDbContext context, IOtpService otpService, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _otpService = otpService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task RequestOtpAsync(string email)
    {
        // 1. Generate code
        var code = _otpService.GenerateCode();
        
        // 2. Hash code
        var codeHash = BCrypt.Net.BCrypt.HashPassword(code);

        // 3. Save OtpRequest
        var otpRequest = new OtpRequest
        {
            Id = Guid.NewGuid(),
            Email = email,
            Channel = OtpChannel.Email,
            CodeHash = codeHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10), // Configurable
            Attempts = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.OtpRequests.Add(otpRequest);
        await _context.SaveChangesAsync();

        // 4. Send email
        await _otpService.SendOtpAsync(email, code, isSms: false);
    }

    public async Task RequestPhoneVerificationAsync(Guid userId, string phoneNumber)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        var code = _otpService.GenerateCode();
        var codeHash = BCrypt.Net.BCrypt.HashPassword(code);

        var otpRequest = new OtpRequest
        {
            Id = Guid.NewGuid(),
            PhoneNumber = phoneNumber, // Should ideally format to E.164
            Channel = OtpChannel.Sms,
            CodeHash = codeHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5),
            Attempts = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.OtpRequests.Add(otpRequest);
        
        // Update user phone number if needed or just use it for verification context
        user.PhoneNumber = phoneNumber; 
        // user.IsPhoneVerified = false; // Reset if changing phone
        
        await _context.SaveChangesAsync();

        await _otpService.SendOtpAsync(phoneNumber, code, isSms: true);
    }

    public async Task VerifyPhoneAsync(Guid userId, string code)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        // Find valid OTP request for this phone number
        var otpRequest = await _context.OtpRequests
            .Where(x => x.PhoneNumber == user.PhoneNumber && x.Channel == OtpChannel.Sms && x.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpRequest == null) throw new Exception("OTP invalid or expired.");
        if (otpRequest.Attempts >= 5) throw new Exception("Too many attempts.");

        if (!BCrypt.Net.BCrypt.Verify(code, otpRequest.CodeHash))
        {
            otpRequest.Attempts++;
            await _context.SaveChangesAsync();
            throw new Exception("Invalid code.");
        }

        user.IsPhoneVerified = true;
        await _context.SaveChangesAsync();
    }

    public async Task<AuthResponseDto> VerifyOtpAsync(string email, string code)
    {
        // 1. Find valid OTP request
        var otpRequest = await _context.OtpRequests
            .Where(x => x.Email == email && x.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpRequest == null)
        {
            throw new Exception("OTP invalid or expired.");
        }

        if (otpRequest.Attempts >= 5)
        {
            throw new Exception("Too many attempts.");
        }

        // 2. Verify hash
        if (!BCrypt.Net.BCrypt.Verify(code, otpRequest.CodeHash))
        {
            otpRequest.Attempts++;
            await _context.SaveChangesAsync();
            throw new Exception("Invalid code.");
        }

        // 3. Find or Create User
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        // 4. Generate Tokens
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        return new AuthResponseDto(
            accessToken, 
            refreshToken, 
            user.Id, 
            user.Email, 
            user.Role.ToString(),
            user.FullName,
            user.SubscriptionType.ToString());
    }

    public async Task<AuthResponseDto> LoginAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            throw new Exception("Invalid email or password.");
        }

        if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new Exception("User account is inactive.");
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        user.FailedLoginCount = 0; // Reset on success
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            user.Id,
            user.Email,
            user.Role.ToString(),
            user.FullName,
            user.SubscriptionType.ToString());
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (!dto.TermsAccepted)
        {
             throw new Exception("Terms of use must be accepted.");
        }

        // CPF validation removed for MVP
        // if (!ValidateCpf(dto.Cpf)) { ... }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            // Cpf = dto.Cpf, // Optional now
            // PhoneNumber = dto.PhoneNumber, // Optional now
            // BirthDate = dto.BirthDate, // Optional now
            // Address = ... // Removed from register
            TermsAccepted = dto.TermsAccepted,
            TermsAcceptedAt = DateTime.UtcNow,
            Role = UserRole.User,
            SubscriptionType = SubscriptionType.Free,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            user.Id,
            user.Email,
            user.Role.ToString(),
            user.FullName,
            user.SubscriptionType.ToString());
    }

    private bool ValidateCpf(string cpf)
    {
        if (string.IsNullOrEmpty(cpf)) return false;
        var cleanCpf = new string(cpf.Where(char.IsDigit).ToArray());

        if (cleanCpf.Length != 11)
            return false;

        if (cleanCpf.Distinct().Count() == 1)
            return false;

        int[] multiplier1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        int sum = 0;
        for (int i = 0; i < 9; i++)
            sum += int.Parse(cleanCpf[i].ToString()) * multiplier1[i];
        
        int remainder = sum % 11;
        int digit1 = remainder < 2 ? 0 : 11 - remainder;

        if (int.Parse(cleanCpf[9].ToString()) != digit1)
            return false;

        int[] multiplier2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        sum = 0;
        for (int i = 0; i < 10; i++)
            sum += int.Parse(cleanCpf[i].ToString()) * multiplier2[i];
        
        remainder = sum % 11;
        int digit2 = remainder < 2 ? 0 : 11 - remainder;

        return int.Parse(cleanCpf[10].ToString()) == digit2;
    }

    public async Task<AuthResponseDto> SocialLoginAsync(SocialLoginDto dto)
    {
        // Mocking Google Token Validation
        // In a real app, you'd use Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(dto.Token)
        
        string email = "";
        string name = "";
        string externalId = "";

        if (dto.Provider.ToLower() == "google")
        {
            // Simulate extracted info from token
            email = "google_user@example.com"; 
            name = "Google User";
            externalId = "google_id_123";
        }
        else
        {
            throw new Exception("Provider not supported.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                FullName = name,
                ExternalProvider = dto.Provider,
                ExternalId = externalId,
                Role = UserRole.User,
                SubscriptionType = SubscriptionType.Free,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            user.Id,
            user.Email,
            user.Role.ToString(),
            user.FullName,
            user.SubscriptionType.ToString());
    }

    public async Task<AuthResponseDto> AdminRegisterAsync(RegisterDto dto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new Exception("User already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            // Cpf = dto.Cpf,
            // PhoneNumber = dto.PhoneNumber,
            // BirthDate = dto.BirthDate,
            // Address = ...
            TermsAccepted = dto.TermsAccepted,
            TermsAcceptedAt = DateTime.UtcNow,
            Role = UserRole.Admin, // Set as Admin
            SubscriptionType = SubscriptionType.Business,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            user.Id,
            user.Email,
            user.Role.ToString(),
            user.FullName,
            user.SubscriptionType.ToString());
    }

    public Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        // Not implemented for MVP fully (needs storage)
        throw new NotImplementedException();
    }
}
