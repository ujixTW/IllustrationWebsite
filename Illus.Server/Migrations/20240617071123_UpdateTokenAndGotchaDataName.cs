using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTokenAndGotchaDataName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvalidTime",
                table: "LoginToken",
                newName: "ExpiryDate");

            migrationBuilder.RenameColumn(
                name: "MailDate",
                table: "Gotcha",
                newName: "ExpiryDate");

            migrationBuilder.AlterColumn<Guid>(
                name: "CAPTCHA",
                table: "Gotcha",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "LoginToken",
                newName: "InvalidTime");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "Gotcha",
                newName: "MailDate");

            migrationBuilder.AlterColumn<string>(
                name: "CAPTCHA",
                table: "Gotcha",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
