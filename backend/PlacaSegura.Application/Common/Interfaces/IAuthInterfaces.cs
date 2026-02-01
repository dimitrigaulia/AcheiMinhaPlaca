using System;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IAuthService
{
    Task RequestOtpAsync(string email);
    Task<AuthResponseDto> VerifyOtpAsync(string email, string code);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
}

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}

public interface IOtpService
{
    string GenerateCode();
    Task SendOtpAsync(string email, string code);
}
