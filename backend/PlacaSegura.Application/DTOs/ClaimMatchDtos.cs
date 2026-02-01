using System;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Application.DTOs;

public record CreateClaimDto(
    Guid LostReportId,
    Guid FoundReportId,
    string SecretLast4
);

public record ClaimDto(
    Guid Id,
    Guid LostReportId,
    Guid FoundReportId,
    ClaimStatus Status,
    DateTime CreatedAt
);

public record MatchDto(
    Guid Id,
    Guid LostReportId,
    Guid FoundReportId,
    MatchStatus Status,
    Guid? SafeLocationId,
    SafeLocation? SafeLocation,
    DateTime CreatedAt
);
