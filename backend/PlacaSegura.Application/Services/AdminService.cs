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

public class AdminService : IAdminService
{
    private readonly IPlacaSeguraDbContext _context;

    public AdminService(IPlacaSeguraDbContext context)
    {
        _context = context;
    }

    public async Task CreateFlagAsync(CreateReportFlagDto dto, Guid userId)
    {
        var flag = new ReportFlag
        {
            Id = Guid.NewGuid(),
            ReportId = dto.ReportId,
            CreatedByUserId = userId,
            Reason = dto.Reason,
            Status = ReportFlagStatus.Open,
            CreatedAt = DateTime.UtcNow
        };

        _context.ReportFlags.Add(flag);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ReportFlagDto>> GetFlagsAsync()
    {
        var flags = await _context.ReportFlags
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        return flags.Select(f => new ReportFlagDto(f.Id, f.ReportId, f.Reason, f.Status, f.CreatedAt)).ToList();
    }

    public async Task RemoveReportByAdminAsync(Guid reportId)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == reportId);
        if (report == null) throw new Exception("Report not found");

        report.Status = ReportStatus.Removed;
        report.RemovedAt = DateTime.UtcNow;
        
        // Also update flags?
        var flags = await _context.ReportFlags.Where(f => f.ReportId == reportId).ToListAsync();
        foreach (var flag in flags)
        {
            flag.Status = ReportFlagStatus.Reviewed;
        }

        await _context.SaveChangesAsync();
    }
}
