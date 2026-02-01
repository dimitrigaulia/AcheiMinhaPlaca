using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

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
