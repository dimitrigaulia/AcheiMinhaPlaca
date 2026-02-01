using System;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IAuthService
{
    Task RequestOtpAsync(string email);
    Task<AuthResponseDto> VerifyOtpAsync(string email, string code);
    
    Task RequestPhoneVerificationAsync(Guid userId, string phoneNumber);
    Task VerifyPhoneAsync(Guid userId, string code);

    Task<AuthResponseDto> LoginAsync(string email, string password);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> SocialLoginAsync(SocialLoginDto dto);
    Task<AuthResponseDto> AdminRegisterAsync(RegisterDto dto);
}

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}

public interface IOtpService
{
    string GenerateCode();
    Task SendOtpAsync(string target, string code, bool isSms = false);
}
