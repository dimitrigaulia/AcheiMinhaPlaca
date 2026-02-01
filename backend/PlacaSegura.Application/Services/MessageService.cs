using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Entities;

namespace PlacaSegura.Application.Services;

public class MessageService : IMessageService
{
    private readonly IPlacaSeguraDbContext _context;

    public MessageService(IPlacaSeguraDbContext context)
    {
        _context = context;
    }

    public async Task<List<MessageDto>> GetMessagesAsync(Guid matchId, Guid userId)
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

        var messages = await _context.Messages
            .Where(m => m.MatchId == matchId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return messages.Select(MapToDto).ToList();
    }

    public async Task<MessageDto> SendMessageAsync(Guid matchId, Guid userId, string body)
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

        var message = new Message
        {
            Id = Guid.NewGuid(),
            MatchId = matchId,
            SenderUserId = userId,
            Body = body,
            CreatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return MapToDto(message);
    }

    private MessageDto MapToDto(Message m)
    {
        return new MessageDto(m.Id, m.MatchId, m.SenderUserId, m.Body, m.CreatedAt);
    }
}
