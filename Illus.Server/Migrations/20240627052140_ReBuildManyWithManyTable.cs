using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Illus.Server.Migrations
{
    /// <inheritdoc />
    public partial class ReBuildManyWithManyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArtworkTags");

            migrationBuilder.CreateTable(
                name: "ArtworkTag",
                columns: table => new
                {
                    ArtworksId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtworkTag", x => new { x.ArtworksId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_ArtworkTag_Artwork_ArtworksId",
                        column: x => x.ArtworksId,
                        principalTable: "Artwork",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArtworkTag_Tag_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArtworkTag_TagsId",
                table: "ArtworkTag",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArtworkTag");

            migrationBuilder.CreateTable(
                name: "ArtworkTags",
                columns: table => new
                {
                    ArtworkId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtworkTags", x => new { x.ArtworkId, x.TagId });
                    table.ForeignKey(
                        name: "FK_ArtworkTags_Artwork_ArtworkId",
                        column: x => x.ArtworkId,
                        principalTable: "Artwork",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArtworkTags_Tag_TagId",
                        column: x => x.TagId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArtworkTags_TagId",
                table: "ArtworkTags",
                column: "TagId");
        }
    }
}
