using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Application.DTOs;

public record CreateReportFlagDto(
    Guid ReportId,
    string Reason
);

public record ReportFlagDto(
    Guid Id,
    Guid ReportId,
    string Reason,
    ReportFlagStatus Status,
    DateTime CreatedAt
);
