using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PlacaSegura.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedSafeLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SafeLocations",
                columns: new[] { "Id", "Address", "City", "IsActive", "Name", "Neighborhood" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Rua Principal, 100", "São Paulo", true, "Delegacia Central", "Centro" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Av. Norte, 500", "São Paulo", true, "Posto Policial Norte", "Santana" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Av. Sul, 200", "São Paulo", true, "Base Comunitária Sul", "Santo Amaro" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Rua do Shopping, 1", "São Paulo", true, "Shopping Center Plaza", "Jardins" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Rua Segura, 99", "Rio de Janeiro", true, "Estacionamento 24h Seguro", "Centro" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SafeLocations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "SafeLocations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "SafeLocations",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "SafeLocations",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "SafeLocations",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));
        }
    }
}
