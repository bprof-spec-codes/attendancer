using System.Security.Claims;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
        public async Task<IActionResult> CreateEventGroupAsync([FromBody] EventGroupCreateDto createDto)
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

        [Authorize]
        [HttpPut("{eventGroupId}")]
        public async Task<IActionResult> UpdateEventGroupAsync(string eventGroupId, [FromBody] EventGroupCreateDto createDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {
                createDto.UserId = userId;

                await _eventGroupService.UpdateEventGroupAsync(eventGroupId, createDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize]
        [HttpDelete("{eventGroupId}")]
        public async Task<IActionResult> DeleteEventGroupAsync(string eventGroupId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }

            try
            {
                await _eventGroupService.DeleteEventGroupAsync(eventGroupId, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
