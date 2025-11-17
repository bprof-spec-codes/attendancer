using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AttenDancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;
        private readonly QrService _qrService;

        public EventController(EventService eventService, QrService qrSrevice)
        {
            _eventService = eventService;
            _qrService = qrSrevice;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDto createDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }


            createDto.UserId = userId;

            await _eventService.CreateEventAsync(createDto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpPost("{eventId}/generate-qr")]
        public async Task<IActionResult> GenerateQrForEvent(string eventId)
        {
            var ev = await _eventService.GetEventAsync(eventId);

            if (!ev.IsQrValid)
            {
                return BadRequest("QR code is invalidated");
            }

            string qrUrl = $"{Request.Scheme}://{Request.Host}/api/event/{eventId}/qr";

            return Ok(new { QrCodeUrl = qrUrl });
        }

        [HttpGet("{eventId}/qr")]
        public async Task<IActionResult> GetEventQrCode(string eventId)
        {
            var ev = await _eventService.GetEventAsync(eventId);

            if (!ev.IsQrValid)
                return BadRequest("QR code is invalidated");

            // A Qr tartalma. Ez konkrétan a participant create végponthoz vezet és ott meglévő adatokkal létrehozza a résztvevőt
            // Például: http://localhost:5000/api/participant/create/{qrCode}
            // A Request Sceme a http vagy https részt adja a Request Host pedig a localhostos részt

            string qrContent = $"{Request.Scheme}://{Request.Host}/api/participant/{eventId}";
            var qrBytes = _qrService.GenerateQrCode(qrContent);

            //Ezzel tudunk visszaadni egy képet, nem application/json lesz a headerben, hanem image/png
            return File(qrBytes, "image/png");
        }

        [HttpPut("{eventId}/invalidate")]
        public async Task<IActionResult> InvalidateQr(string eventId)
        {
            await _eventService.InValidateQrAsync(eventId);
            return Ok();
        }

        [HttpPut("{eventId}/validate")]
        public async Task<IActionResult> validateQr(string eventId)
        {
            await _eventService.ValidateQrAsync(eventId);
            return Ok();
        }

    }
}
