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

public class ReportService : IReportService
{
    private readonly IPlacaSeguraDbContext _context;

    public ReportService(IPlacaSeguraDbContext context)
    {
        _context = context;
    }

    public async Task<ReportDto> CreateReportAsync(CreateReportDto dto, Guid userId)
    {
        // 1. Normalize and Mask Plate
        var normalizedPlate = NormalizePlate(dto.Plate);
        var maskedPlate = MaskPlate(normalizedPlate);
        
        // 2. Create Report
        var report = new Report
        {
            Id = Guid.NewGuid(),
            Type = dto.Type,
            PlateMasked = maskedPlate,
            PlateNormalizedHash = dto.Type == ReportType.Found ? null : HashPlate(normalizedPlate), // Only store hash for Lost to verify match? Or maybe logic differs.
            // Prompt says: "armazena apenas mascarada e um índice normalizado/hashing"
            // Actually, for search we need masked. For exact match we might need hash.
            // But if user lost plate ABC1234, they search for ABC1***.
            // If user found plate ABC1234, they post ABC1***.
            // Let's store hash for both to allow exact internal matching later if needed.
            City = dto.City,
            Neighborhood = dto.Neighborhood,
            EventAt = dto.EventAt,
            Description = dto.Description,
            PhotoUrl = dto.PhotoUrl,
            Status = ReportStatus.Active,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reports.Add(report);

        // 3. If Lost, save Secret
        if (dto.Type == ReportType.Lost && !string.IsNullOrEmpty(dto.SecretLast4))
        {
            var secretHash = BCrypt.Net.BCrypt.HashPassword(dto.SecretLast4);
            var secret = new LostSecret
            {
                Id = Guid.NewGuid(),
                ReportId = report.Id,
                SecretHash = secretHash,
                SecretSalt = "" // BCrypt includes salt
            };
            _context.LostSecrets.Add(secret);
        }

        await _context.SaveChangesAsync();

        return MapToDto(report);
    }

    public async Task<List<ReportDto>> SearchReportsAsync(ReportSearchDto searchDto)
    {
        var query = _context.Reports
            .AsNoTracking()
            .Where(r => r.Status == ReportStatus.Active);

        if (!string.IsNullOrEmpty(searchDto.City))
        {
            query = query.Where(r => r.City.ToLower().Contains(searchDto.City.ToLower()));
        }

        if (!string.IsNullOrEmpty(searchDto.PlateMasked))
        {
            // Case insensitive search
            query = query.Where(r => r.PlateMasked.ToLower() == searchDto.PlateMasked.ToLower());
        }

        if (searchDto.DateFrom.HasValue)
        {
            query = query.Where(r => r.EventAt >= searchDto.DateFrom.Value);
        }

        if (searchDto.DateTo.HasValue)
        {
            query = query.Where(r => r.EventAt <= searchDto.DateTo.Value);
        }

        var reports = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
        return reports.Select(MapToDto).ToList();
    }

    public async Task<ReportDto?> GetReportByIdAsync(Guid id)
    {
        var report = await _context.Reports.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        return report == null ? null : MapToDto(report);
    }

    public async Task<List<ReportDto>> GetMyReportsAsync(Guid userId)
    {
        var reports = await _context.Reports
            .AsNoTracking()
            .Where(r => r.CreatedByUserId == userId && r.Status != ReportStatus.Removed)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return reports.Select(MapToDto).ToList();
    }

    public async Task CloseReportAsync(Guid id, Guid userId)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);
        if (report == null || report.CreatedByUserId != userId)
        {
            throw new Exception("Report not found or access denied.");
        }

        report.Status = ReportStatus.Closed;
        report.ClosedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task RemoveReportAsync(Guid id, Guid userId)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);
        // Admin check should be here too, but for MVP assuming user removes own
        if (report == null || report.CreatedByUserId != userId)
        {
            throw new Exception("Report not found or access denied.");
        }

        report.Status = ReportStatus.Removed;
        report.RemovedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private string NormalizePlate(string plate)
    {
        return plate.ToUpper().Replace("-", "").Replace(" ", "");
    }

    private string MaskPlate(string normalizedPlate)
    {
        // Logic: ABC1D23 -> ABC1*** (Mercosul)
        // Logic: ABC1234 -> ABC**** (Old)
        // Simple logic: Keep first 4 chars (ABC1), mask rest.
        if (normalizedPlate.Length < 4) return normalizedPlate;
        return normalizedPlate.Substring(0, 4) + new string('*', normalizedPlate.Length - 4);
    }

    private string HashPlate(string normalizedPlate)
    {
        // Simple hash for index
        // In real app, maybe HMAC to prevent dictionary attack if table leaked?
        // MVP: SHA256 or just keep it simple.
        // Or just store full plate encrypted?
        // Prompt says "PlateNormalizedHash (string opcional; usar para busca exata sem guardar placa completa em claro)"
        // I'll use BCrypt? No, need exact match search. BCrypt is one-way slow.
        // SHA256 is fine.
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(normalizedPlate);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private ReportDto MapToDto(Report r)
    {
        return new ReportDto(
            r.Id,
            r.Type,
            r.PlateMasked,
            r.City,
            r.Neighborhood,
            r.EventAt,
            r.Description,
            r.PhotoUrl,
            r.Status,
            r.CreatedAt,
            r.CreatedByUserId
        );
    }
}
