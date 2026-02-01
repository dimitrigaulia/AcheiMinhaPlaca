using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.DTOs;

namespace PlacaSegura.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [Authorize]
    [HttpPost("phone/request")]
    public async Task<IActionResult> RequestPhoneVerification([FromBody] PhoneVerificationRequestDto dto)
    {
        var userId = Guid.Parse(User.FindFirst("sub")?.Value ?? throw new Exception("User ID not found"));
        await _authService.RequestPhoneVerificationAsync(userId, dto.PhoneNumber);
        return Ok(new { message = "Verification code sent to phone." });
    }

    [Authorize]
    [HttpPost("phone/verify")]
    public async Task<IActionResult> VerifyPhone([FromBody] PhoneVerificationVerifyDto dto)
    {
        var userId = Guid.Parse(User.FindFirst("sub")?.Value ?? throw new Exception("User ID not found"));
        await _authService.VerifyPhoneAsync(userId, dto.Code);
        return Ok(new { message = "Phone verified successfully." });
    }

    [HttpPost("otp/request")]
    public async Task<IActionResult> RequestOtp([FromBody] OtpRequestDto dto)
    {
        await _authService.RequestOtpAsync(dto.Email);
        return Ok(new { message = "OTP sent if email is valid." });
    }

    [HttpPost("otp/verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyDto dto)
    {
        var response = await _authService.VerifyOtpAsync(dto.Email, dto.Code);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var response = await _authService.LoginAsync(dto.Email, dto.Password);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var response = await _authService.RegisterAsync(dto);
        return Ok(response);
    }

    [HttpPost("social")]
    public async Task<IActionResult> SocialLogin([FromBody] SocialLoginDto dto)
    {
        var response = await _authService.SocialLoginAsync(dto);
        return Ok(response);
    }

    [HttpPost("admin/register")]
    public async Task<IActionResult> AdminRegister([FromBody] RegisterDto dto)
    {
        // In a real app, this should be protected by an API Key or existing Admin role
        var response = await _authService.AdminRegisterAsync(dto);
        return Ok(response);
    }
}
