using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Services;
using PlacaSegura.Application.DTOs;
using PlacaSegura.Infrastructure.Persistence;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;

namespace PlacaSegura.UnitTests.Services;

public class AuthServiceTests
{
    private readonly PlacaSeguraDbContext _context;
    private readonly Mock<IOtpService> _otpServiceMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<PlacaSeguraDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _context = new PlacaSeguraDbContext(options);
        _otpServiceMock = new Mock<IOtpService>();
        _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
        
        _authService = new AuthService(_context, _otpServiceMock.Object, _jwtTokenGeneratorMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_Should_Succeed_When_Data_Valid()
    {
        var dto = new RegisterDto(
            "test@test.com", "Test User", "Password@123", "11144477735", "11999999999", 
            DateTime.Now.AddYears(-20), "00000000", "Street", "1", null, "N", "City", "SP", true
        );

        _jwtTokenGeneratorMock.Setup(x => x.GenerateAccessToken(It.IsAny<User>())).Returns("access_token");
        _jwtTokenGeneratorMock.Setup(x => x.GenerateRefreshToken()).Returns("refresh_token");

        var result = await _authService.RegisterAsync(dto);

        Assert.NotNull(result);
        Assert.Equal("test@test.com", result.Email);
        Assert.NotNull(await _context.Users.FirstOrDefaultAsync(u => u.Email == "test@test.com"));
    }
    
    [Fact]
    public async Task RegisterAsync_Should_Throw_When_Terms_Not_Accepted()
    {
        var dto = new RegisterDto(
            "test@test.com", "Test User", "Password@123", "96605574066", "11999999999", 
            DateTime.Now.AddYears(-20), "00000000", "Street", "1", null, "N", "City", "SP", false
        );

        var ex = await Assert.ThrowsAsync<Exception>(() => _authService.RegisterAsync(dto));
        Assert.Contains("Terms of use", ex.Message);
    }
}
