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

    public async Task SendOtpAsync(string email, string code)
    {
        var retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                (exception, timeSpan, retryCount, context) =>
                {
                    _logger.LogWarning($"Falha ao enviar OTP (Tentativa {retryCount}). Erro: {exception.Message}. Retentando em {timeSpan.TotalSeconds}s...");
                });

        await retryPolicy.ExecuteAsync(async () =>
        {
             try 
             {
                // MVP: Log to console
                _logger.LogInformation("==========================================");
                _logger.LogInformation($"[OTP SENDER] Email: {email} | Code: {code}");
                _logger.LogInformation("==========================================");
                
                await Task.CompletedTask;
             }
             catch (Exception ex)
             {
                 _logger.LogError(ex, "Erro crítico ao enviar OTP.");
                 throw;
             }
        });
    }
}
