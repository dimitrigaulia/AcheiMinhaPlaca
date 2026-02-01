using System;

namespace PlacaSegura.Domain.Entities;

public class SafeLocation
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Neighborhood { get; set; }
    public bool IsActive { get; set; }
}
