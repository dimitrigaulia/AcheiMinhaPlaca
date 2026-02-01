using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Api.Controllers;

[ApiController]
[Route("matches")]
[Authorize]
public class MatchesController : ControllerBase
{
    private readonly IClaimService _claimService;
    private readonly IMessageService _messageService;

    public MatchesController(IClaimService claimService, IMessageService messageService)
    {
        _claimService = claimService;
        _messageService = messageService;
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var matches = await _claimService.GetMyMatchesAsync(userId);
        return Ok(matches);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var match = await _claimService.GetMatchByIdAsync(id, userId);
        if (match == null) return NotFound();
        return Ok(match);
    }

    [HttpPost("{id}/safe-location")]
    public async Task<IActionResult> SetSafeLocation(Guid id, [FromBody] Guid safeLocationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            await _claimService.SetSafeLocationAsync(id, safeLocationId, userId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> Close(Guid id, [FromBody] MatchStatus status)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            await _claimService.CloseMatchAsync(id, status, userId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [HttpGet("safe-locations")]
    public async Task<IActionResult> GetSafeLocations()
    {
        var locations = await _claimService.GetSafeLocationsAsync();
        return Ok(locations);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var messages = await _messageService.GetMessagesAsync(id, userId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] CreateMessageDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var message = await _messageService.SendMessageAsync(id, userId, dto.Body);
            return Ok(message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
