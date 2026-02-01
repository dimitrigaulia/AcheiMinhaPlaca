using System;

namespace PlacaSegura.Application.DTOs;

public record OtpRequestDto(string Email);

public record OtpVerifyDto(string Email, string Code);

public record RefreshTokenDto(string RefreshToken);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    Guid UserId,
    string Email,
    string Role
);
