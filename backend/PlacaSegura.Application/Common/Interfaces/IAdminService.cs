using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IAdminService
{
    Task CreateFlagAsync(CreateReportFlagDto dto, Guid userId);
    Task<List<ReportFlagDto>> GetFlagsAsync();
    Task RemoveReportByAdminAsync(Guid reportId);
}
