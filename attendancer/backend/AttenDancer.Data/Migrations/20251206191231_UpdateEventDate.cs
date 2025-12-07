using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEventDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "58148cbb-f925-45ee-a4a1-17e2f981c8bc",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "abcf9f45-d59d-4229-b13a-28e9a35718ca",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "asd43vx5-x3fd-df34-sdf3-ngunds823sd2",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "fsd32dfs-asd3-a23f-b53d-s7mkds8u3fdi",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "jdididld-ldkd-opc9-u8dd-ldidd88339ld",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "kc984ecc-cdkl-dsdf-45ge-md74j473kjd8",
                column: "Date",
                value: new DateTime(2025, 9, 30, 16, 2, 20, DateTimeKind.Utc).ToString());
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
