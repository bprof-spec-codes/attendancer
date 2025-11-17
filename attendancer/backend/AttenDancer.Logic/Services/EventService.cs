using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Services
{
    public class EventService
    {
        private readonly IRepository<Event> _eventRepository;
        DtoProvider dtoProvider;
        public EventService(IRepository<Event> eventRepository, DtoProvider dtoProvider)
        {
            _eventRepository = eventRepository;
            this.dtoProvider = dtoProvider;
        }

        public async Task<Event> CreateEventAsync(EventCreateDto createDto)
        {
            var newEvent = dtoProvider.Mapper.Map<Event>(createDto);
            return await _eventRepository.Create(newEvent);
        }

        public async Task<EventViewDto> GetEventAsync(string eventId)
        {
            Event? getevent = await _eventRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventId);

            if (getevent == null)
            {
                throw new Exception("Hibás esemény azonosító");
            }

            EventViewDto eventView = dtoProvider.Mapper.Map<EventViewDto>(getevent);
            return eventView;
        }

        public async Task<List<EventViewDto>> GetAllEventsAsync()
        {
            List<EventViewDto> events = dtoProvider.Mapper.Map<List<EventViewDto>>(await _eventRepository.GetAll().ToListAsync());
            return events;
        }

        public async Task<List<EventViewDto>> GetEventByUserIdAsync(string userId)
        {
            var events = await _eventRepository
                .GetAll()
                .Where(e => e.UserId == userId)
                .ToListAsync();

            if (!events.Any())
            {
                throw new Exception("Nincs a felhasználóhoz tartozó esemény.");
            }

            List<EventViewDto> result = dtoProvider.Mapper.Map<List<EventViewDto>>(events);
            return result;
        }

        public async Task<Event> UpdateEventAsync(EventCreateDto updatedto, string id)
        {
            Event? existingEvent = await _eventRepository.GetAll().FirstOrDefaultAsync(e => e.Id == id);

            if (existingEvent == null)
            {
                throw new Exception("Esemény nem található");
            }

            dtoProvider.Mapper.Map(updatedto, existingEvent);
            return await _eventRepository.Update(existingEvent);
        }

        public async Task<Event> InValidateQrAsync(string eventId)
        {
            Event? existingEvent = await _eventRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventId);
            if (existingEvent == null)
            {
                throw new Exception("Esemény nem található");

            }
            existingEvent.IsQrValid = false;
            return await _eventRepository.Update(existingEvent);
        }

        public async Task<Event> ValidateQrAsync(string eventId)
        {
            Event? existingEvent = await _eventRepository.GetAll().FirstOrDefaultAsync(e => e.Id == eventId);
            if (existingEvent == null)
            {
                throw new Exception("Esemény nem található");

            }
            existingEvent.IsQrValid = true;
            return await _eventRepository.Update(existingEvent);
        }

        public void DeleteEvent(string eventId)
        {
            _eventRepository.DeleteById(eventId);
        }
    }
}
