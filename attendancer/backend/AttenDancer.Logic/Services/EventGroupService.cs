using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Services
{
    public class EventGroupService
    {
        private readonly IRepository<EventGroup> _eventGroupRepository;
        private readonly IRepository<Event> _eventRepository;
        DtoProvider dtoProvider;

        public EventGroupService(IRepository<EventGroup> eventGroupRepository, DtoProvider dtoProvider, IRepository<Event> eventRepository)
        {
            _eventGroupRepository = eventGroupRepository;
            this.dtoProvider = dtoProvider;
            _eventRepository = eventRepository;
        }

        public async Task<EventGroup> CreateEventGroupAsync(EventGroupCreateDto createDto)
        {
            if (createDto.EventIds == null || createDto.EventIds.Count == 0)
            {
                throw new Exception("Eseménycsoportnak legalább egy eseményt tartalmaznia kell.");
            }
            List<Event> events = _eventRepository.GetAll().Where(e => createDto.EventIds.Contains(e.Id)).ToList();
            events.Where(e => e.UserId != createDto.UserId).ToList().ForEach(e =>
            {
                throw new Exception($"Az eseménycsoport létrehozásához minden eseménynek ugyanahhoz a felhasználóhoz kell tartoznia." +
                    $" Hibás esemény azonosító: {e.Id}");
            });
            var newEventGroup = dtoProvider.Mapper.Map<EventGroup>(createDto);
            await _eventGroupRepository.Create(newEventGroup);

            foreach (var ev in events)
            {
                ev.EventGroupId = newEventGroup.Id;
                await _eventRepository.Update(ev);
            }

            return newEventGroup;
        }

        public async Task<EventGroupViewDto> GetEventGroupByIDAsync(string eventGroupId)
        {
            EventGroupViewDto eventGroup = dtoProvider.Mapper.Map<EventGroupViewDto>(await _eventGroupRepository.GetAll()
                .FirstOrDefaultAsync(e => e.Id == eventGroupId));

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            return eventGroup;
        }

        public async Task<EventGroupParticipantInfoDto> GetParticipantFromEventGroupByIDAsync(string eventGroupId, string userId)
        {
            EventGroup? eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            EventGroupParticipantInfoDto eventGroupView = dtoProvider.Mapper.Map<EventGroupParticipantInfoDto>(eventGroup, opt => opt.Items["userId"] = userId);

            return eventGroupView;
        }

        public async Task<EventGroup> UpdateEventGroupAsync(string eventGroupId, EventGroupCreateDto createDto)
        {
            if (createDto.EventIds== null || createDto.EventIds.Count == 0)
            {
                throw new Exception("Eseménycsoportnak legalább egy eseményt tartalmaznia kell.");
            }

            EventGroup? eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            if (eventGroup.UserId != createDto.UserId)
            {
                throw new Exception("Eseménycsoportot csak a tulajdonosa tudja módosítani");
            }

            var oldEvents = eventGroup.Events.ToList();

            foreach (var e in oldEvents)
            {
                e.EventGroupId = null;
                await _eventRepository.Update(e);
            }

            List<Event> events = _eventRepository.GetAll().Where(e => createDto.EventIds.Contains(e.Id)).ToList();
            events.Where(e => e.UserId != createDto.UserId).ToList().ForEach(e =>
            {
                throw new Exception($"Az eseménycsoport létrehozásához minden eseménynek ugyanahhoz a felhasználóhoz kell tartoznia." +
                    $" Hibás esemény azonosító: {e.Id}");
            });

            eventGroup.Name = createDto.Name;
            eventGroup.Events = events;
            await _eventGroupRepository.Update(eventGroup);

            foreach (var ev in events)
            {
                ev.EventGroupId = eventGroup.Id;
                await _eventRepository.Update(ev);
            }
            return eventGroup;
        }

        public void DeleteEventGroup(string eventGroupId)
        {
            _eventGroupRepository.DeleteById(eventGroupId);
        }

        public async Task DeleteEventGroupAsync(string eventGroupId, string userId)
        {
            EventGroup? eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            if (eventGroup.UserId != userId)
            {
                throw new Exception("Eseménycsoportot csak a tulajdonosa tudja kitörölni");
            }

            var events = eventGroup.Events.ToList();

            foreach (var e in events)
            {
                e.EventGroupId = null;
                await _eventRepository.Update(e);
            }

            await _eventGroupRepository.DeleteById(eventGroupId);




        }
    }
}
