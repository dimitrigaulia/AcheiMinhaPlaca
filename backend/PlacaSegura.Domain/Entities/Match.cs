using System;
using System.Collections.Generic;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Domain.Entities;

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
