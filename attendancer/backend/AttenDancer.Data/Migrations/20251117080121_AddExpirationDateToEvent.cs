using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddExpirationDateToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "Events",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "DATEADD(day, 1, GETUTCDATE())"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "Events"
            );
        }
    }
}
