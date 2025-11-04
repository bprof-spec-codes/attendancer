using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
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

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDto createDto)
        {
            await _eventService.CreateEventAsync(createDto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        

    }
}
