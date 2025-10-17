using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
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
    }
}
