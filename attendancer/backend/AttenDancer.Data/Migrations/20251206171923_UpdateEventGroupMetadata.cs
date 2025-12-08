using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEventGroupMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EventGroups",
                keyColumn: "Id",
                keyValue: "18f2745f-652e-4817-b7e1-ea7787fc71c8",
                column: "Metadata",
                value: "[\"neptun\",\"seat\"]");

            migrationBuilder.UpdateData(
                table: "EventGroups",
                keyColumn: "Id",
                keyValue: "fd3f3srf-d3rs-x3sd-dffe-jdud8du8kd89",
                column: "Metadata",
                value: "[\"neptun\",\"seat\"]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "EventGroups",
                keyColumn: "Id",
                keyValue: "18f2745f-652e-4817-b7e1-ea7787fc71c8",
                column: "Metadata",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "EventGroups",
                keyColumn: "Id",
                keyValue: "fd3f3srf-d3rs-x3sd-dffe-jdud8du8kd89",
                column: "Metadata",
                value: "[]");
        }
    }
}
