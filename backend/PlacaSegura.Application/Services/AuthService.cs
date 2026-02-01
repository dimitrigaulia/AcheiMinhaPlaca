using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;

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
        
        // 2. Hash code (simple hash for MVP, ideally use BCrypt but checking hash is easier if plain)
        // Wait, requirements say "CodeHash". I'll store BCrypt hash.
        var codeHash = BCrypt.Net.BCrypt.HashPassword(code);

        // 3. Save OtpRequest
        var otpRequest = new OtpRequest
        {
            Id = Guid.NewGuid(),
            Email = email,
            CodeHash = codeHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10), // Configurable
            Attempts = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.OtpRequests.Add(otpRequest);
        await _context.SaveChangesAsync();

        // 4. Send email
        await _otpService.SendOtpAsync(email, code);
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

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
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
            Role = UserRole.User,
            SubscriptionType = SubscriptionType.Free,
            CreatedAt = DateTime.UtcNow
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
            Role = UserRole.Admin, // Set as Admin
            SubscriptionType = SubscriptionType.Business,
            CreatedAt = DateTime.UtcNow
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
