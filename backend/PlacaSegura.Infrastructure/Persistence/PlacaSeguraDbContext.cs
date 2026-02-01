using Microsoft.EntityFrameworkCore;
using PlacaSegura.Application.Common.Interfaces;
using PlacaSegura.Domain.Entities;

namespace PlacaSegura.Infrastructure.Persistence;

public class PlacaSeguraDbContext : DbContext, IPlacaSeguraDbContext
{
    public PlacaSeguraDbContext(DbContextOptions<PlacaSeguraDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<OtpRequest> OtpRequests { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<LostSecret> LostSecrets { get; set; }
    public DbSet<Claim> Claims { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<SafeLocation> SafeLocations { get; set; }
    public DbSet<ReportFlag> ReportFlags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasIndex(x => x.Cpf).IsUnique();
            e.Property(x => x.Role).HasConversion<int>();
            e.Property(x => x.SubscriptionType).HasConversion<int>();
            
            e.OwnsOne(x => x.Address);
        });

        // Report
        modelBuilder.Entity<Report>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.City, x.PlateMasked, x.Status });
            e.HasIndex(x => x.EventAt);
            e.Property(x => x.Type).HasConversion<int>();
            e.Property(x => x.Status).HasConversion<int>();
            
            e.HasOne(x => x.CreatedByUser)
             .WithMany()
             .HasForeignKey(x => x.CreatedByUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // LostSecret
        modelBuilder.Entity<LostSecret>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.ReportId).IsUnique();
            e.HasOne(x => x.Report)
             .WithOne()
             .HasForeignKey<LostSecret>(x => x.ReportId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Claim
        modelBuilder.Entity<Claim>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Status).HasConversion<int>();
            
            e.HasOne(x => x.LostReport)
             .WithMany()
             .HasForeignKey(x => x.LostReportId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.FoundReport)
             .WithMany()
             .HasForeignKey(x => x.FoundReportId)
             .OnDelete(DeleteBehavior.Restrict);
             
            e.HasOne(x => x.CreatedByUser)
             .WithMany()
             .HasForeignKey(x => x.CreatedByUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Match
        modelBuilder.Entity<Match>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.LostReportId, x.FoundReportId }).IsUnique();
            e.Property(x => x.Status).HasConversion<int>();

            e.HasOne(x => x.LostReport)
             .WithMany()
             .HasForeignKey(x => x.LostReportId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.FoundReport)
             .WithMany()
             .HasForeignKey(x => x.FoundReportId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.SafeLocation)
             .WithMany()
             .HasForeignKey(x => x.SafeLocationId);
        });

        // Message
        modelBuilder.Entity<Message>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.MatchId, x.CreatedAt });
            
            e.HasOne(x => x.Match)
             .WithMany(m => m.Messages)
             .HasForeignKey(x => x.MatchId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.SenderUser)
             .WithMany()
             .HasForeignKey(x => x.SenderUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ReportFlag
        modelBuilder.Entity<ReportFlag>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Status).HasConversion<int>();
            
            e.HasOne(x => x.Report)
             .WithMany()
             .HasForeignKey(x => x.ReportId)
             .OnDelete(DeleteBehavior.Cascade);
             
            e.HasOne(x => x.CreatedByUser)
             .WithMany()
             .HasForeignKey(x => x.CreatedByUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed SafeLocations
        modelBuilder.Entity<SafeLocation>().HasData(
            new SafeLocation { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Delegacia Central", Address = "Rua Principal, 100", City = "São Paulo", Neighborhood = "Centro", IsActive = true },
            new SafeLocation { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Posto Policial Norte", Address = "Av. Norte, 500", City = "São Paulo", Neighborhood = "Santana", IsActive = true },
            new SafeLocation { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Base Comunitária Sul", Address = "Av. Sul, 200", City = "São Paulo", Neighborhood = "Santo Amaro", IsActive = true },
            new SafeLocation { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Shopping Center Plaza", Address = "Rua do Shopping, 1", City = "São Paulo", Neighborhood = "Jardins", IsActive = true },
            new SafeLocation { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Estacionamento 24h Seguro", Address = "Rua Segura, 99", City = "Rio de Janeiro", Neighborhood = "Centro", IsActive = true }
        );
    }
}
