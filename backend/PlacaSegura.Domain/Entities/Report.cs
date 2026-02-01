using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

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
