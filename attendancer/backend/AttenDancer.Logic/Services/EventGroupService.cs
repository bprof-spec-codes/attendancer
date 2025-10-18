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
        DtoProvider dtoProvider;

        public EventGroupService(IRepository<EventGroup> eventGroupRepository, DtoProvider dtoProvider)
        {
            _eventGroupRepository = eventGroupRepository;
            this.dtoProvider = dtoProvider;
        }

        public async Task<EventGroup> CreateEventGroupAsync(EventGroupCreateDto createDto)
        {
            var newEventGroup = dtoProvider.Mapper.Map<EventGroup>(createDto);
            return await _eventGroupRepository.Create(newEventGroup);
        }

        public async Task<EventGroupViewDto> GetEventGroupByID(string eventGroupId)
        {
            EventGroupViewDto eventGroup = dtoProvider.Mapper.Map<EventGroupViewDto>(await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId));

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
    }
}
