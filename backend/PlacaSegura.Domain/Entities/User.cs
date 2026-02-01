using System;
using PlacaSegura.Domain.Enums;
using PlacaSegura.Domain.ValueObjects;

namespace PlacaSegura.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? FullName { get; set; }
    
    // LGPD/Security adjustments: CPF and Phone should be optional/nullable
    // In production, consider encrypting these or hashing them
    public string? Cpf { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? BirthDate { get; set; }
    
    public Address? Address { get; set; }
    
    public bool TermsAccepted { get; set; }
    public DateTime? TermsAcceptedAt { get; set; }

    public UserRole Role { get; set; }
    public string? ExternalProvider { get; set; }
    public string? ExternalId { get; set; }
    public SubscriptionType SubscriptionType { get; set; } = SubscriptionType.Free;
    public DateTime? SubscriptionExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }

    // Security Fields
    public bool IsActive { get; set; } = true;
    public bool IsEmailVerified { get; set; } = false;
    public bool IsPhoneVerified { get; set; } = false;
    public int FailedLoginCount { get; set; } = 0;
    public DateTime? LockoutUntilUtc { get; set; }
    public DateTime? LastLoginAtUtc { get; set; }
}
