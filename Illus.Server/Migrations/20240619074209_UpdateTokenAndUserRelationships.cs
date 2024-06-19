using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTokenAndUserRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LoginToken_UserId",
                table: "LoginToken");

            migrationBuilder.CreateIndex(
                name: "IX_LoginToken_UserId",
                table: "LoginToken",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LoginToken_UserId",
                table: "LoginToken");

            migrationBuilder.CreateIndex(
                name: "IX_LoginToken_UserId",
                table: "LoginToken",
                column: "UserId",
                unique: true);
        }
    }
}
