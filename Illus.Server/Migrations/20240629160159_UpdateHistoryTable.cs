using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHistoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_History_Artwork_ArtworkId",
                table: "History");

            migrationBuilder.DropForeignKey(
                name: "FK_History_User_UserId",
                table: "History");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "History",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ArtworkId",
                table: "History",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_History_Artwork_ArtworkId",
                table: "History",
                column: "ArtworkId",
                principalTable: "Artwork",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_History_User_UserId",
                table: "History",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_History_Artwork_ArtworkId",
                table: "History");

            migrationBuilder.DropForeignKey(
                name: "FK_History_User_UserId",
                table: "History");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "History",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ArtworkId",
                table: "History",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_History_Artwork_ArtworkId",
                table: "History",
                column: "ArtworkId",
                principalTable: "Artwork",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_History_User_UserId",
                table: "History",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
