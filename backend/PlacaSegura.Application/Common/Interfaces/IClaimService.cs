using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IClaimService
{
    Task<MatchDto> CreateClaimAsync(CreateClaimDto dto, Guid userId);
    Task<List<MatchDto>> GetMyMatchesAsync(Guid userId);
    Task<MatchDto?> GetMatchByIdAsync(Guid id, Guid userId);
    Task SetSafeLocationAsync(Guid matchId, Guid safeLocationId, Guid userId);
    Task CloseMatchAsync(Guid matchId, MatchStatus status, Guid userId);
    Task<List<SafeLocation>> GetSafeLocationsAsync();
}
