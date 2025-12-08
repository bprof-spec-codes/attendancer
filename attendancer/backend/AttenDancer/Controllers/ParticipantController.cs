using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateParticipant([FromBody] ParticipantCreateDto createDto)
        {
            await _participantService.CreateParticipantAsync(createDto);
            return  Ok();
        }

        //[Authorize]
        [HttpGet]
        public async Task<List<ParticipantViewDto>> GetParticipants(string id)
        {
            return await _participantService.GetParticipantsAsync(id);
        }
    }
}
