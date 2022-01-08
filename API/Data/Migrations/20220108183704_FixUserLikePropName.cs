using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class FixUserLikePropName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_SourUserId",
                table: "Likes");

            migrationBuilder.RenameColumn(
                name: "SourUserId",
                table: "Likes",
                newName: "SourceUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_SourceUserId",
                table: "Likes",
                column: "SourceUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_SourceUserId",
                table: "Likes");

            migrationBuilder.RenameColumn(
                name: "SourceUserId",
                table: "Likes",
                newName: "SourUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_SourUserId",
                table: "Likes",
                column: "SourUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
