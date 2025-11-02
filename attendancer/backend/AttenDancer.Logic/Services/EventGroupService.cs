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
            return await _eventGroupRepository.Create(newEventGroup);
        }

        public async Task<EventGroupViewDto> GetEventGroupByID(string eventGroupId)
        {
            EventGroupViewDto eventGroup = dtoProvider.Mapper.Map<EventGroupViewDto>(await _eventGroupRepository.GetAll()
                .FirstOrDefaultAsync(e => e.Id == eventGroupId));

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            return eventGroup;
        }

        public async Task<EventGroupParticipantInfoDto> GetParticipantFromEventGroupByID(string eventGroupId, string userId)
        {
            EventGroup? eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            EventGroupParticipantInfoDto eventGroupView = dtoProvider.Mapper.Map<EventGroupParticipantInfoDto>(eventGroup, opt => opt.Items["userId"] = userId);

            return eventGroupView;
        }

        public async Task<EventGroup> UpdateEventGroup(List<string> eventIds, string name, string eventGroupId)
        {
            EventGroup? eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            List<Event> events = _eventRepository.GetAll().Where(e => eventIds.Contains(e.Id)).ToList();

            eventGroup.Name = name;
            eventGroup.Events = events;
            return await _eventGroupRepository.Update(eventGroup);
        }

        public void DeleteEventGroup(string eventGroupId)
        {
            _eventGroupRepository.DeleteById(eventGroupId);
        }
    }
}
