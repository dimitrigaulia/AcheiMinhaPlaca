using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Application.Services;

namespace PlacaSegura.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IClaimService, ClaimService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IAdminService, AdminService>();
        return services;
    }
}
