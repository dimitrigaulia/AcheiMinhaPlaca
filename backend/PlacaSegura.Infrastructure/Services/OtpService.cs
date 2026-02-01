using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlacaSegura.Application.Common.Interfaces;

namespace PlacaSegura.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<OtpService> _logger;

    public OtpService(IConfiguration configuration, ILogger<OtpService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public string GenerateCode()
    {
        int length = int.Parse(_configuration["OTP:CodeLength"] ?? "6");
        var random = new Random();
        string code = "";
        for (int i = 0; i < length; i++)
        {
            code += random.Next(0, 10).ToString();
        }
        return code;
    }

    public Task SendOtpAsync(string email, string code)
    {
        // MVP: Log to console
        _logger.LogInformation("==========================================");
        _logger.LogInformation($"[OTP SENDER] Email: {email} | Code: {code}");
        _logger.LogInformation("==========================================");
        
        return Task.CompletedTask;
    }
}
