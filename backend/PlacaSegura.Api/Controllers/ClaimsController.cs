using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Api.Controllers;

[ApiController]
[Route("claims")]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly IClaimService _claimService;
    private readonly IPlacaSeguraDbContext _context;

    public ClaimsController(IClaimService claimService, IPlacaSeguraDbContext context)
    {
        _claimService = claimService;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClaimDto dto)
    {
        var userId = Guid.Parse(User.FindFirst("sub")?.Value ?? throw new Exception("User ID not found"));
        
        // Guard: Phone verification required
        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.IsPhoneVerified)
        {
            return BadRequest(new { message = "Phone verification is required to create a claim." });
        }

        var claim = await _claimService.CreateClaimAsync(dto, userId);
        return Ok(claim);
    }
}
