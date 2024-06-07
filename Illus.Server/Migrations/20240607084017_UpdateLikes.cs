using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Like",
                table: "Like");

            migrationBuilder.RenameColumn(
                name: "LikeTime",
                table: "Like",
                newName: "CreateTime");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Like",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "Like",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateTime",
                table: "Like",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LikeCounts",
                table: "Artwork",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReadCounts",
                table: "Artwork",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Like",
                table: "Like",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Like_ArtworkId",
                table: "Like",
                column: "ArtworkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Like",
                table: "Like");

            migrationBuilder.DropIndex(
                name: "IX_Like_ArtworkId",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "LikeCounts",
                table: "Artwork");

            migrationBuilder.DropColumn(
                name: "ReadCounts",
                table: "Artwork");

            migrationBuilder.RenameColumn(
                name: "CreateTime",
                table: "Like",
                newName: "LikeTime");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Like",
                table: "Like",
                columns: new[] { "ArtworkId", "UserId" });
        }
    }
}
