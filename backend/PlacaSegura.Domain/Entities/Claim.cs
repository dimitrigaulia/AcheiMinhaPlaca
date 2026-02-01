using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

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
