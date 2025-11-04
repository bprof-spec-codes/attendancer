using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttenDancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantController : ControllerBase
    {
        private readonly ParticipantService _participantService;
        public ParticipantController(ParticipantService participantService)
        {
            _participantService = participantService;
        }

        [HttpPost("{createDto.EventId}")]
        [Authorize]
        public async Task<IActionResult> CreateParticipant([FromBody] ParticipantCreateDto createDto)
        {
            var participant = await _participantService.CreateParticipantAsync(createDto);
            return Ok();
        }
    }
}
