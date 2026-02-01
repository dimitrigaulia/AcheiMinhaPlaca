using System;

namespace PlacaSegura.Application.DTOs;

public record OtpRequestDto(string Email);

public record OtpVerifyDto(string Email, string Code);

public record LoginDto(string Email, string Password);

public record RefreshTokenDto(string RefreshToken);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    Guid UserId,
    string Email,
    string Role,
    string? FullName = null,
    string? SubscriptionType = "Free"
);

public record RegisterDto(
    string Email, 
    string FullName,
    string Password,
    string Cpf,
    string PhoneNumber,
    DateTime BirthDate,
    string ZipCode,
    string Street,
    string Number,
    string? Complement,
    string Neighborhood,
    string City,
    string State,
    bool TermsAccepted
);

public record PhoneVerificationRequestDto(string PhoneNumber);

public record PhoneVerificationVerifyDto(string Code);

public record SocialLoginDto(string Provider, string Token);
