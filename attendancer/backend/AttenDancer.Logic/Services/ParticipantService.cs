using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Participant> CreateParticipantAsync(ParticipantCreateDto createDto)
        {
            Event Getevent = _eventRepository.GetAll().FirstOrDefault(e => e.Id == createDto.EventId);
            if(!Getevent.IsQrValid)
            {
                throw new Exception("Az esemény QR kódja érvénytelenítve van, nem lehet résztvevőt hozzáadni.");
            }

            var existingParticipant = _participantRepository.GetAll()
                .FirstOrDefault(p => p.EventId == createDto.EventId && p.UserId == createDto.UserId);
            if (existingParticipant != null)
            {
                throw new Exception("A felhasználó már résztvevőként van regisztrálva ezen az eseményen.");
            }
            //if(!(createDto.Metadata.ToList().Count() == Getevent.Metadata.ToList().Count()))
            //{
            //    throw new Exception("A metaadatok hibásan vannak megadva.");
            //}
            var participant = dtoProvider.Mapper.Map<Participant>(createDto);
            return await _participantRepository.Create(participant);
        }

        public async Task<List<ParticipantViewDto>> GetParticipantsAsync(string eventid)
        {
            Event getevent = await _eventRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventid);

            if (getevent == null)
            {
                throw new Exception("Hibás esemény azonosító");
            }

            List<ParticipantViewDto> participants = new List<ParticipantViewDto>();
            foreach (var participant in getevent.Participants)
            {
                ParticipantViewDto participantView = dtoProvider.Mapper.Map<ParticipantViewDto>(participant);
                participants.Add(participantView);
            }
            
            return participants;
        }


       
    }
}
