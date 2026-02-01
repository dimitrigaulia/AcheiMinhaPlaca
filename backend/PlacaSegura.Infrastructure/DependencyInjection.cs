using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Infrastructure.Auth;
using PlacaSegura.Infrastructure.Persistence;
using PlacaSegura.Infrastructure.Services;

namespace PlacaSegura.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<PlacaSeguraDbContext>(options =>
        //     options.UseNpgsql(
        //         configuration.GetConnectionString("Default"),
        //         b => b.MigrationsAssembly(typeof(PlacaSeguraDbContext).Assembly.FullName)));

        services.AddDbContext<PlacaSeguraDbContext>(options =>
            options.UseInMemoryDatabase("PlacaSeguraDb"));

        services.AddScoped<IPlacaSeguraDbContext>(provider => provider.GetRequiredService<PlacaSeguraDbContext>());
        
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IOtpService, OtpService>();

        return services;
    }
}
