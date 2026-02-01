using Microsoft.EntityFrameworkCore;
using PlacaSegura.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace PlacaSegura.Application.Common.Interfaces;

public interface IPlacaSeguraDbContext
{
    DbSet<User> Users { get; }
    DbSet<OtpRequest> OtpRequests { get; }
    DbSet<Report> Reports { get; }
    DbSet<LostSecret> LostSecrets { get; }
    DbSet<Claim> Claims { get; }
    DbSet<Match> Matches { get; }
    DbSet<Message> Messages { get; }
    DbSet<SafeLocation> SafeLocations { get; }
    DbSet<ReportFlag> ReportFlags { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
