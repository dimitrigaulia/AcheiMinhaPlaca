using System;

namespace PlacaSegura.Application.DTOs;

public record MessageDto(
    Guid Id,
    Guid MatchId,
    Guid SenderUserId,
    string Body,
    DateTime CreatedAt
);

public record CreateMessageDto(
    string Body
);
