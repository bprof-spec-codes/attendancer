using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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

            Event newEvent = await _eventService.CreateEventAsync(createDto);
            return Ok(newEvent.Id);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventById(string eventId)
        {

            try
            {
                var e = await _eventService.GetEventAsync(eventId);
                return Ok(e);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("/GetEventByUserId")]
        public async Task<IActionResult> GetEventByUserIdAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }


            var events = await _eventService.GetEventByUserIdAsync(userId);
            return Ok(events);
        }

        [Authorize]
        [HttpPut("{eventId}")]
        public async Task<IActionResult> UpdateEventAsync([FromBody] EventUpdateDto dto, string eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }

            try
            {
                dto.UserId = userId;

                await _eventService.UpdateEventAsync(dto, eventId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> DeleteEvent(string eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }

            try
            {
                await _eventService.DeleteAsync(userId, eventId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
