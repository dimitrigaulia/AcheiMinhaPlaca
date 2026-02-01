using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IReportService
{
    Task<ReportDto> CreateReportAsync(CreateReportDto dto, Guid userId);
    Task<List<ReportDto>> SearchReportsAsync(ReportSearchDto searchDto);
    Task<ReportDto?> GetReportByIdAsync(Guid id);
    Task<List<ReportDto>> GetMyReportsAsync(Guid userId);
    Task CloseReportAsync(Guid id, Guid userId);
    Task RemoveReportAsync(Guid id, Guid userId); // Soft delete
}
