using System;

namespace PlacaSegura.Domain.Entities;

public class LostSecret
{
    public Guid Id { get; set; } // PK, or can use ReportId as PK
    public Guid ReportId { get; set; }
    public Report? Report { get; set; }
    
    public string SecretHash { get; set; } = string.Empty;
    public string SecretSalt { get; set; } = string.Empty;
}
