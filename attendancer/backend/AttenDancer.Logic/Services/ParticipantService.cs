using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Services
{
    public class ParticipantService
    {
        private readonly IRepository<Participant> _participantRepository;
        private readonly IRepository<Event> _eventRepository;
        DtoProvider dtoProvider;
        public ParticipantService(IRepository<Participant> participantRepository, IRepository<Event> eventRepository, DtoProvider dtoProvider)
        {
            _participantRepository = participantRepository;
            _eventRepository = eventRepository;
            this.dtoProvider = dtoProvider;
        }

        public async Task<Participant> AddParticipantAsync(ParticipantCreateDto createDto)
        {
            var participant = dtoProvider.Mapper.Map<Participant>(createDto);
            return await _participantRepository.Create(participant);
        }

        public async Task<List<ParticipantViewDto>> GetParticipants(string eventid)
        {
            Event getevent = _eventRepository.GetAll().FirstOrDefault(e => e.Id == eventid);

            if (getevent == null)
            {
                throw new Exception("Hibás esemény azonosító");
            }

            List<ParticipantViewDto> participants = dtoProvider.Mapper.Map<List<ParticipantViewDto>>(getevent.Participants.ToList());
            return participants;
        }
    }
}
