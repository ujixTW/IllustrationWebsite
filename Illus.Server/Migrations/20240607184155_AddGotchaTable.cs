using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddGotchaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PasswordSalt",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Gotcha",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CAPTCHA = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MailDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gotcha", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Gotcha_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Gotcha");

            migrationBuilder.DropColumn(
                name: "EmailConfirmed",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "User");
        }
    }
}
