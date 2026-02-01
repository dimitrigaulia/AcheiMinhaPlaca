using System;
using System.Collections.Generic;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class OtpRequest
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string CodeHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int Attempts { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Report
{
    public Guid Id { get; set; }
    public ReportType Type { get; set; }
    public string PlateMasked { get; set; } = string.Empty;
    public string? PlateNormalizedHash { get; set; }
    public string City { get; set; } = string.Empty;
    public string? Neighborhood { get; set; }
    public DateTime EventAt { get; set; }
    public string? Description { get; set; }
    public string? PhotoUrl { get; set; }
    public ReportStatus Status { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public DateTime? RemovedAt { get; set; }
}

public class LostSecret
{
    public Guid Id { get; set; } // PK, or can use ReportId as PK
    public Guid ReportId { get; set; }
    public Report? Report { get; set; }
    
    public string SecretHash { get; set; } = string.Empty;
    public string SecretSalt { get; set; } = string.Empty;
}

public class Claim
{
    public Guid Id { get; set; }
    public Guid LostReportId { get; set; }
    public Report? LostReport { get; set; }
    
    public Guid FoundReportId { get; set; }
    public Report? FoundReport { get; set; }
    
    public ClaimStatus Status { get; set; }
    public int AttemptsCount { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
}

public class Match
{
    public Guid Id { get; set; }
    public Guid LostReportId { get; set; }
    public Report? LostReport { get; set; }
    
    public Guid FoundReportId { get; set; }
    public Report? FoundReport { get; set; }
    
    public MatchStatus Status { get; set; }
    
    public Guid? SafeLocationId { get; set; }
    public SafeLocation? SafeLocation { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}

public class Message
{
    public Guid Id { get; set; }
    public Guid MatchId { get; set; }
    public Match? Match { get; set; }
    
    public Guid SenderUserId { get; set; }
    public User? SenderUser { get; set; }
    
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class SafeLocation
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Neighborhood { get; set; }
    public bool IsActive { get; set; }
}

public class ReportFlag
{
    public Guid Id { get; set; }
    public Guid ReportId { get; set; }
    public Report? Report { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
    
    public string Reason { get; set; } = string.Empty;
    public ReportFlagStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
