using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Api.Controllers;

[ApiController]
[Route("reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IWebHostEnvironment _environment;

    public ReportsController(IReportService reportService, IWebHostEnvironment environment)
    {
        _reportService = reportService;
        _environment = environment;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] ReportSearchDto searchDto)
    {
        var result = await _reportService.SearchReportsAsync(searchDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _reportService.GetReportByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize]
    [HttpPost("lost")]
    public async Task<IActionResult> CreateLost([FromBody] CreateReportDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _reportService.CreateReportAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPost("found")]
    public async Task<IActionResult> CreateFound([FromForm] CreateReportDto dto, IFormFile? photo)
    {
        // Handle Photo Upload
        string? photoUrl = null;
        if (photo != null && photo.Length > 0)
        {
            var uploads = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
            var filePath = Path.Combine(uploads, fileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(stream);
            }
            
            // Assume URL logic (e.g. host/uploads/filename)
            // Ideally should be absolute or handled by frontend
            photoUrl = $"/uploads/{fileName}";
        }

        var dtoWithPhoto = dto with { PhotoUrl = photoUrl };

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _reportService.CreateReportAsync(dtoWithPhoto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _reportService.GetMyReportsAsync(userId);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/close")]
    public async Task<IActionResult> Close(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _reportService.CloseReportAsync(id, userId);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _reportService.RemoveReportAsync(id, userId);
        return NoContent();
    }
}
