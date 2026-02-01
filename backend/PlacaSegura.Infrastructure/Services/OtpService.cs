using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlacaSegura.Application.Common.Interfaces;
using Polly;

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

    public async Task SendOtpAsync(string target, string code, bool isSms = false)
    {
        var retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

        await retryPolicy.ExecuteAsync(async () =>
        {
            if (isSms)
            {
                 // Simulation of SMS sending
                _logger.LogInformation($"[SMS MOCK] Sending OTP {code} to {target}");
            }
            else
            {
                // Simulation of Email sending
                _logger.LogInformation($"[EMAIL MOCK] Sending OTP {code} to {target}");
            }
            
            await Task.CompletedTask;
        });
    }
}
