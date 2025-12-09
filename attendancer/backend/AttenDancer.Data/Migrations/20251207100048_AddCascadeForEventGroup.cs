using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeForEventGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_EventGroups_EventGroupId",
                table: "Events");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_EventGroups_EventGroupId",
                table: "Events",
                column: "EventGroupId",
                principalTable: "EventGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_EventGroups_EventGroupId",
                table: "Events");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_EventGroups_EventGroupId",
                table: "Events",
                column: "EventGroupId",
                principalTable: "EventGroups",
                principalColumn: "Id");
        }
    }
}
