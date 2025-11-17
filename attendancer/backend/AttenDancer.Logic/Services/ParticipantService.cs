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

            var participant = dtoProvider.Mapper.Map<Participant>(createDto);
            return await _participantRepository.Create(participant);
        }

        public async Task<List<ParticipantViewDto>> GetParticipantsAsync(string eventid)
        {
            Event getevent = _eventRepository.GetAll().FirstOrDefault(e => e.Id == eventid);

            if (getevent == null)
            {
                throw new Exception("Hibás esemény azonosító");
            }

            List<ParticipantViewDto> participants = dtoProvider.Mapper.Map<List<ParticipantViewDto>>(getevent.Participants.ToList());
            return participants;
        }


        public async Task<List<EventSignedByUserViewDto>> GetSignedSheetsAsync(string userId)
        {
            var signedEvents = await _participantRepository.GetAll()
                .Where(p => p.UserId == userId)
                .Include(p => p.Event)
                    .ThenInclude(e => e.EventGroup)
                .OrderByDescending(p => p.Date)
                .Select(p => new EventSignedByUserViewDto
                {
                    Id = p.Event.Id,
                    Name = p.Event.Name,
                    SignedAt = p.Date,
                    EventGroupName = p.Event.EventGroup != null ? p.Event.EventGroup.Name : null,
                    ExpirationDate = p.Event.ExpirationDate,
                    IsQrValid = p.Event.IsQrValid
                })
                .ToListAsync();

            return signedEvents;
        }
    }
}
