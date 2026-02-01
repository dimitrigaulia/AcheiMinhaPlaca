using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PlacaSegura.Application;
using PlacaSegura.Infrastructure;
using PlacaSegura.Domain.Entities;
using PlacaSegura.Domain.Enums;
using PlacaSegura.Domain.ValueObjects;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "PlacaSegura API v1");
    });
}

app.UseCors("AllowFrontend");

// app.UseHttpsRedirection(); // Disable HTTPS Redirection for Dev to fix CORS redirect issue

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Seed Database (Postgres)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PlacaSegura.Infrastructure.Persistence.PlacaSeguraDbContext>();
    dbContext.Database.Migrate();

    // Seed Master Admin
    var adminEmail = "dimitrifgaulia@gmail.com";
    if (!dbContext.Users.Any(u => u.Email == adminEmail))
    {
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = adminEmail,
            FullName = "Master Admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
            Cpf = "96605574066",
            PhoneNumber = "(11) 99999-9999",
            BirthDate = new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            Address = new Address
            {
                ZipCode = "01001-000",
                Street = "Praça da Sé",
                Number = "1",
                Neighborhood = "Sé",
                City = "São Paulo",
                State = "SP"
            },
            TermsAccepted = true,
            TermsAcceptedAt = DateTime.UtcNow,
            Role = UserRole.Admin,
            SubscriptionType = SubscriptionType.Business,
            CreatedAt = DateTime.UtcNow
        };
        dbContext.Users.Add(admin);
        dbContext.SaveChanges();
    }
}

app.MapControllers();

app.Run();
