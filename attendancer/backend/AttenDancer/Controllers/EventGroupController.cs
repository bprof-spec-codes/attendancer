using System.Security.Claims;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttenDancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventGroupController : ControllerBase
    {
        private readonly EventGroupService _eventGroupService;

        public EventGroupController(EventGroupService eventGroupService)
        {
            _eventGroupService = eventGroupService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEventGroup([FromBody] EventGroupCreateDto createDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {
                createDto.UserId = userId;

                await _eventGroupService.CreateEventGroupAsync(createDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
    }
}
