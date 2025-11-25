using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AttenDancer.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventModelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password" },
                values: new object[,]
                {
                    { "22f10921-4a13-48ce-aaf8-61f99c0e3433", "janos.kovacs@example.com", "János", "Kovács", "$2a$12$W/5Oa.ZAHo5kOYXkM6xZlO9T7VrehdFZCRmxUiehWhJeiDPDiid0C" },
                    { "843f06a0-befe-48a3-8a3d-6ad8ca807670", "peter.toth@example.com", "Péter", "Tóth", "$2a$12$96CPpvdEUa0RdOlHnuC7pOBp1/e8n80M4G4Nb1vnk21.OMH7FAubW" },
                    { "b5f30803-2ff2-42a3-8353-20fc04bd0992", "anna.nagy@example.com", "Anna", "Nagy", "$2a$12$9hDRjL5dqLM7n3fzviXlOuusJEts86QEhw4cXmdoQwZ8mbUB.oP.G" }
                });

            migrationBuilder.InsertData(
                table: "EventGroups",
                columns: new[] { "Id", "Name", "UserId" },
                values: new object[] { "18f2745f-652e-4817-b7e1-ea7787fc71c8", "Adatbázisok 2024/25 őszi félév", "22f10921-4a13-48ce-aaf8-61f99c0e3433" });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "EventGroupId", "Metadata", "Name", "QrCode", "UserId" },
                values: new object[,]
                {
                    { "58148cbb-f925-45ee-a4a1-17e2f981c8bc", "18f2745f-652e-4817-b7e1-ea7787fc71c8", "neptun,seat", "Adatbázisok - 2. előadás", "QR_CODE_EVENT_2_DEF456", "22f10921-4a13-48ce-aaf8-61f99c0e3433" },
                    { "abcf9f45-d59d-4229-b13a-28e9a35718ca", "18f2745f-652e-4817-b7e1-ea7787fc71c8", "neptun,seat", "Adatbázisok - 1. előadás", "QR_CODE_EVENT_1_ABC123", "22f10921-4a13-48ce-aaf8-61f99c0e3433" }
                });

            migrationBuilder.InsertData(
                table: "Participants",
                columns: new[] { "Id", "Date", "EventId", "Metadata", "UserId" },
                values: new object[,]
                {
                    { "c2f8c2ea-d385-466f-ad97-74c762114fc1", new DateTime(2025, 9, 30, 16, 2, 20, 252, DateTimeKind.Utc).AddTicks(9410), "abcf9f45-d59d-4229-b13a-28e9a35718ca", "{\"neptun\":\"ABC123\",\"seat\":\"12A\"}", "b5f30803-2ff2-42a3-8353-20fc04bd0992" },
                    { "cc3e1c61-b5ca-4042-a7b8-d2505d433530", new DateTime(2025, 9, 30, 16, 2, 20, 252, DateTimeKind.Utc).AddTicks(9856), "abcf9f45-d59d-4229-b13a-28e9a35718ca", "{\"neptun\":\"DEF456\",\"seat\":\"15B\"}", "843f06a0-befe-48a3-8a3d-6ad8ca807670" },
                    { "e2580ebc-b428-47b0-852b-0453d580414e", new DateTime(2025, 10, 1, 16, 2, 20, 252, DateTimeKind.Utc).AddTicks(9862), "58148cbb-f925-45ee-a4a1-17e2f981c8bc", "{\"neptun\":\"ABC123\",\"seat\":\"10C\"}", "b5f30803-2ff2-42a3-8353-20fc04bd0992" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Participants",
                keyColumn: "Id",
                keyValue: "c2f8c2ea-d385-466f-ad97-74c762114fc1");

            migrationBuilder.DeleteData(
                table: "Participants",
                keyColumn: "Id",
                keyValue: "cc3e1c61-b5ca-4042-a7b8-d2505d433530");

            migrationBuilder.DeleteData(
                table: "Participants",
                keyColumn: "Id",
                keyValue: "e2580ebc-b428-47b0-852b-0453d580414e");

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "58148cbb-f925-45ee-a4a1-17e2f981c8bc");

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: "abcf9f45-d59d-4229-b13a-28e9a35718ca");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "843f06a0-befe-48a3-8a3d-6ad8ca807670");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "b5f30803-2ff2-42a3-8353-20fc04bd0992");

            migrationBuilder.DeleteData(
                table: "EventGroups",
                keyColumn: "Id",
                keyValue: "18f2745f-652e-4817-b7e1-ea7787fc71c8");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "22f10921-4a13-48ce-aaf8-61f99c0e3433");
        }
    }
}
