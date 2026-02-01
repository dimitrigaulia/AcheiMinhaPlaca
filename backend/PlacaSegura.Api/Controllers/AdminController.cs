using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.Api.Controllers;

[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [Authorize]
    [HttpPost("reports/{id}/flag")]
    public async Task<IActionResult> FlagReport(Guid id, [FromBody] CreateReportFlagDto dto)
    {
        // User can flag
        if (id != dto.ReportId) return BadRequest("Id mismatch");
        
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _adminService.CreateFlagAsync(dto, userId);
        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("flags")]
    public async Task<IActionResult> GetFlags()
    {
        var flags = await _adminService.GetFlagsAsync();
        return Ok(flags);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reports/{id}/remove")]
    public async Task<IActionResult> RemoveReport(Guid id)
    {
        await _adminService.RemoveReportByAdminAsync(id);
        return NoContent();
    }
}
