using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Application.Services;

public class ClaimService : IClaimService
{
    private readonly IPlacaSeguraDbContext _context;

    public ClaimService(IPlacaSeguraDbContext context)
    {
        _context = context;
    }

    public async Task<MatchDto> CreateClaimAsync(CreateClaimDto dto, Guid userId)
    {
        // 1. Verify Lost Report ownership
        var lostReport = await _context.Reports
            .Include(r => r.CreatedByUser)
            .FirstOrDefaultAsync(r => r.Id == dto.LostReportId);

        if (lostReport == null || lostReport.CreatedByUserId != userId || lostReport.Type != ReportType.Lost)
        {
            throw new Exception("Invalid Lost Report.");
        }

        // 2. Verify Found Report existence
        var foundReport = await _context.Reports.FirstOrDefaultAsync(r => r.Id == dto.FoundReportId);
        if (foundReport == null || foundReport.Type != ReportType.Found)
        {
            throw new Exception("Invalid Found Report.");
        }

        // 3. Get Lost Secret
        var secret = await _context.LostSecrets.FirstOrDefaultAsync(s => s.ReportId == lostReport.Id);
        if (secret == null)
        {
            throw new Exception("Lost report has no secret configured.");
        }

        // 4. Check existing claim or match
        var existingClaim = await _context.Claims
            .FirstOrDefaultAsync(c => c.LostReportId == dto.LostReportId && c.FoundReportId == dto.FoundReportId);

        if (existingClaim != null)
        {
            if (existingClaim.AttemptsCount >= 5) // Limit attempts
            {
                throw new Exception("Too many failed attempts for this claim.");
            }
            if (existingClaim.Status == ClaimStatus.Verified)
            {
                throw new Exception("Claim already verified.");
            }
        }
        else
        {
            existingClaim = new Claim
            {
                Id = Guid.NewGuid(),
                LostReportId = dto.LostReportId,
                FoundReportId = dto.FoundReportId,
                Status = ClaimStatus.Pending,
                AttemptsCount = 0,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Claims.Add(existingClaim);
        }

        // 5. Verify Secret
        bool isMatch = BCrypt.Net.BCrypt.Verify(dto.SecretLast4, secret.SecretHash);

        if (!isMatch)
        {
            existingClaim.AttemptsCount++;
            existingClaim.Status = ClaimStatus.Rejected; // Or keep Pending? Rejected usually final.
            // If we allow retries, maybe keep Pending but increment count.
            // Let's keep Pending but check count at start.
            if (existingClaim.AttemptsCount >= 5) existingClaim.Status = ClaimStatus.Rejected;
            
            await _context.SaveChangesAsync();
            throw new Exception("Incorrect secret.");
        }

        // 6. Success: Verify Claim and Create Match
        existingClaim.Status = ClaimStatus.Verified;
        existingClaim.VerifiedAt = DateTime.UtcNow;

        var match = new Match
        {
            Id = Guid.NewGuid(),
            LostReportId = dto.LostReportId,
            FoundReportId = dto.FoundReportId,
            Status = MatchStatus.Open,
            CreatedAt = DateTime.UtcNow
        };
        _context.Matches.Add(match);

        // Update Reports Status
        lostReport.Status = ReportStatus.Matched;
        foundReport.Status = ReportStatus.Matched;

        await _context.SaveChangesAsync();

        return MapToMatchDto(match);
    }

    public async Task<List<MatchDto>> GetMyMatchesAsync(Guid userId)
    {
        // Match involves LostReport (owned by user) OR FoundReport (owned by user)
        // Actually, user who claimed owns the LostReport.
        // The other user owns the FoundReport.
        // Both should see the match.

        var matches = await _context.Matches
            .Include(m => m.LostReport)
            .Include(m => m.FoundReport)
            .Include(m => m.SafeLocation)
            .Where(m => m.LostReport!.CreatedByUserId == userId || m.FoundReport!.CreatedByUserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return matches.Select(MapToMatchDto).ToList();
    }

    public async Task<MatchDto?> GetMatchByIdAsync(Guid id, Guid userId)
    {
        var match = await _context.Matches
            .Include(m => m.LostReport)
            .Include(m => m.FoundReport)
            .Include(m => m.SafeLocation)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null) return null;

        // Check access
        if (match.LostReport!.CreatedByUserId != userId && match.FoundReport!.CreatedByUserId != userId)
        {
            return null; // Access denied
        }

        return MapToMatchDto(match);
    }

    public async Task SetSafeLocationAsync(Guid matchId, Guid safeLocationId, Guid userId)
    {
        var match = await _context.Matches
            .Include(m => m.LostReport)
            .Include(m => m.FoundReport)
            .FirstOrDefaultAsync(m => m.Id == matchId);

        if (match == null) throw new Exception("Match not found.");

        if (match.LostReport!.CreatedByUserId != userId && match.FoundReport!.CreatedByUserId != userId)
        {
            throw new Exception("Access denied.");
        }

        match.SafeLocationId = safeLocationId;
        await _context.SaveChangesAsync();
    }

    public async Task CloseMatchAsync(Guid matchId, MatchStatus status, Guid userId)
    {
        var match = await _context.Matches
            .Include(m => m.LostReport)
            .Include(m => m.FoundReport)
            .FirstOrDefaultAsync(m => m.Id == matchId);

        if (match == null) throw new Exception("Match not found.");

        if (match.LostReport!.CreatedByUserId != userId && match.FoundReport!.CreatedByUserId != userId)
        {
            throw new Exception("Access denied.");
        }

        match.Status = status;
        match.ClosedAt = DateTime.UtcNow;
        
        // If HandedOver, close reports?
        if (status == MatchStatus.HandedOver)
        {
            match.LostReport!.Status = ReportStatus.Closed;
            match.FoundReport!.Status = ReportStatus.Closed;
            match.LostReport.ClosedAt = DateTime.UtcNow;
            match.FoundReport.ClosedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<SafeLocation>> GetSafeLocationsAsync()
    {
        return await _context.SafeLocations
            .Where(x => x.IsActive)
            .ToListAsync();
    }

    private MatchDto MapToMatchDto(Match m)
    {
        return new MatchDto(
            m.Id,
            m.LostReportId,
            m.FoundReportId,
            m.Status,
            m.SafeLocationId,
            m.SafeLocation,
            m.CreatedAt
        );
    }
}
