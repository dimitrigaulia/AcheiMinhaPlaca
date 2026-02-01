using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IMessageService
{
    Task<List<MessageDto>> GetMessagesAsync(Guid matchId, Guid userId);
    Task<MessageDto> SendMessageAsync(Guid matchId, Guid userId, string body);
}
