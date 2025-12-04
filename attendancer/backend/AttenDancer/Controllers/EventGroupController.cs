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
        [HttpGet("ByUserId")]
        public async Task<IActionResult> GetEventGroupsByUserIdAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {   
                return Ok(await _eventGroupService.GetEventGroupsByUserIdAsync(userId));
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

        [Authorize]
        [HttpGet("{eventGroupId}")]
        public async Task<IActionResult> GetEventGroupByIdAsync(string eventGroupId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {
                
                return Ok(await _eventGroupService.GetEventGroupByIDAsync(eventGroupId, userId));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllEventGroupAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {

                return Ok(await _eventGroupService.GetAllEventGroupAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize]
        [HttpGet("{eventGroupId}/{userId}")]
        public async Task<IActionResult> GetEventGGetParticipantFromEventGroupByIDAsyncroupByIdAsync(string eventGroupId, string userId)
        {
            var Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {

                return Ok(await _eventGroupService.GetParticipantFromEventGroupByIDAsync(eventGroupId, userId));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize]
        [HttpGet("{eventGroupId}/matrix")]
        public async Task<IActionResult> GetEventGroupMatrix(string eventGroupId) 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(new { message = "Érvénytelen token" });
            }
            try
            {
                var matrix = await _eventGroupService.GetEventGroupMatrixAsync(eventGroupId, userId);
                return Ok(matrix);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }


        }
    }
}
