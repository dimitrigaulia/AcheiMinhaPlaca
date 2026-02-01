using System;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Application.DTOs;

public record CreateReportDto(
    ReportType Type,
    string City,
    string? Neighborhood,
    string Plate,
    DateTime EventAt,
    string? Description,
    string? SecretLast4, // For Lost
    string? PhotoUrl // For Found
);

public record ReportDto(
    Guid Id,
    ReportType Type,
    string PlateMasked,
    string City,
    string? Neighborhood,
    DateTime EventAt,
    string? Description,
    string? PhotoUrl,
    ReportStatus Status,
    DateTime CreatedAt,
    Guid CreatedByUserId
);

public record ReportSearchDto(
    string? City,
    string? PlateMasked,
    DateTime? DateFrom,
    DateTime? DateTo
);
