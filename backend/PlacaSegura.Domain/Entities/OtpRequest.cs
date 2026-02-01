using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

public class OtpRequest
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public OtpChannel Channel { get; set; }
    public string CodeHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int Attempts { get; set; }
    public DateTime CreatedAt { get; set; }
}
