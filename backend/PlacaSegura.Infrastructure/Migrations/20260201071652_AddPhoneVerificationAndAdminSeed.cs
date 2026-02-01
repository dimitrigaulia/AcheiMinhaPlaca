using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlacaSegura.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPhoneVerificationAndAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPhoneVerified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "OtpRequests",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "Channel",
                table: "OtpRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "OtpRequests",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Cpf", "CreatedAt", "Email", "ExternalId", "ExternalProvider", "FailedLoginCount", "FullName", "IsActive", "IsEmailVerified", "IsPhoneVerified", "LastLoginAtUtc", "LockoutUntilUtc", "PasswordHash", "PhoneNumber", "Role", "SubscriptionExpiresAt", "SubscriptionType", "TermsAccepted", "TermsAcceptedAt" },
                values: new object[] { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), null, null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "dimitrifgaulia@gmail.com", null, null, 0, "Dimitri Gaulia", true, true, true, null, null, "$2a$11$Rb9TDqUHNnEY49VXkxzPGORF54fB49ZwrDTVYJ5Q0mAPUWHq4RiD.", "13992111026", 1, null, 2, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.DropColumn(
                name: "IsPhoneVerified",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Channel",
                table: "OtpRequests");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "OtpRequests");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "OtpRequests",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
