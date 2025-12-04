using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

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

            if(events.Count != 1 && (events.All(e => e.Metadata.SequenceEqual(events[0].Metadata))))
            {
                throw new Exception("A csoporthoz tartozó események metadata értékei nem egyeznek meg.");
            }
            else
            {
                newEventGroup.Metadata = events[0].Metadata;
            }

            await _eventGroupRepository.Create(newEventGroup);

            foreach (var ev in events)
            {
                ev.EventGroupId = newEventGroup.Id;
                await _eventRepository.Update(ev);
            }

            return newEventGroup;
        }

        public async Task<List<EventGroupViewDto>> GetAllEventGroupAsync()
        {
            List<EventGroupViewDto> events = dtoProvider.Mapper.Map<List<EventGroupViewDto>>(await _eventGroupRepository.GetAll().ToListAsync());
            return events;
        }

        public async Task<EventGroupViewDto> GetEventGroupByIDAsync(string eventGroupId, string userId)
        {
            EventGroup eventGroup = await _eventGroupRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventGroupId);

            if (eventGroup == null)
            {
                throw new Exception("Hibás eseménycsoport azonosító");
            }

            if (eventGroup.UserId != userId)
            {
                throw new Exception("Eseménycsoportot csak a tulajdonosa kérheti le");
            }

            EventGroupViewDto eventGroupview = dtoProvider.Mapper.Map<EventGroupViewDto>(eventGroup);

            return eventGroupview;
        }

        public async Task<List<EventGroupViewDto>> GetEventGroupsByUserIdAsync(string userId)
        {
            var eventGroups = await _eventGroupRepository
                .GetAll()
                .Where(eg => eg.UserId == userId)
                .ToListAsync();

            if (!eventGroups.Any())
            {
                throw new Exception("A felhasználónak nincsenek eseménycsoportjai.");
            }

            return dtoProvider.Mapper.Map<List<EventGroupViewDto>>(eventGroups);
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

        public async Task<EventGroupMatrixViewDto> GetEventGroupMatrixAsync(string eventGroupId, string userId) 
        {

            var eventGroup = await _eventGroupRepository.GetAll()
                .Include(eg => eg.Events)
                    .ThenInclude(e => e.Participants)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(eg => eg.Id == eventGroupId);

            if (eventGroup == null) 
            { 
                throw new Exception("Hibás eseménycsoport azonosító.");
            }

            if(eventGroup.UserId != userId)
            {
                throw new Exception("Az eseménycsoport nem ehhez a felhasználóhoz tartozik.");
            }

            var events = eventGroup.Events
                .OrderBy(e => e.Id)
                .ToList();

            if(!events.Any())
            {
                return new EventGroupMatrixViewDto
                {
                    EventGroupId = eventGroup.Id,
                    EventGroupName = eventGroup.Name,
                    Events = new List<MatrixEventColumnDto>(),
                    Participants = new List<MatrixParticipantRowDto>()
                };
            }

            var allParticipantUsers = events
                .SelectMany(e => e.Participants)
                .Select(p => p.User)
                .DistinctBy( u => u.Id)
                .Where(u => !u.IsDeleted)
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .ToList();

            var participantRows = allParticipantUsers.Select(user =>
            {
                var attendances = events.ToDictionary(
                    e => e.Id,
                    e => e.Participants.Any(p => p.UserId == user.Id)
                );

                return new MatrixParticipantRowDto
                {
                    UserId = user.Id,
                    UserName = $"{user.LastName} {user.FirstName}",
                    UserEmail = user.Email,
                    Attendances = attendances
                };
            }).ToList();

            return new EventGroupMatrixViewDto
            {
                EventGroupId = eventGroup.Id,
                EventGroupName = eventGroup.Name,
                Events = events.Select(e => new MatrixEventColumnDto
                {
                    EventId = e.Id,
                    EventName = e.Name
                }).ToList(),
                Participants = participantRows
            };
        }
    }
}
