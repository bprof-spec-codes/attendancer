using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class RandomChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QrCode",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "QrCodeValue",
                table: "Events",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QrCodeValue",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "QrCode",
                table: "Events",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }
    }
}
