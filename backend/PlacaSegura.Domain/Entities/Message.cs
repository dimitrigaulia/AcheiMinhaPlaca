using System;

namespace PlacaSegura.Domain.Entities;

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
