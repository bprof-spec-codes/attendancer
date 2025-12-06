using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using AttenDancer.Logic.Services;
using MockQueryable;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Tests.Services
{
    [TestFixture]
    public class EventServiceTests
    {

        private Mock<IRepository<Event>> _mockEventRepository;
        private EventService _eventService;
        private DtoProvider _dtoProvider;

        [SetUp]
        public void Setup()
        {

            _mockEventRepository = new Mock<IRepository<Event>>();


            var mockUserRepository = new Mock<IRepository<User>>();
            _dtoProvider = new DtoProvider(mockUserRepository.Object);


            _eventService = new EventService(
                _mockEventRepository.Object,
                _dtoProvider
            );
        }

        [Test]
        public async Task CreateEventAsyncValidDtoShouldCreateEventSuccessfully()
        {
            
            var createDto = new EventCreateDto
            {
                Name = "Test Event",
                UserId = "user1",
                Date = "2025-12-01",
                Metadata = new List<string> { "meta1", "meta2" }
            };

            _mockEventRepository.Setup(r => r.Create(It.IsAny<Event>()))
                .ReturnsAsync((Event e) => e);

            
            var result = await _eventService.CreateEventAsync(createDto);

            
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo(createDto.Name));
            Assert.That(result.UserId, Is.EqualTo(createDto.UserId));
            _mockEventRepository.Verify(r => r.Create(It.IsAny<Event>()), Times.Once);
        }


        [Test]
        public async Task GetEventByUserIdAsyncValidUserWithEventsShouldReturnEvents()
        {
            
            var userId = "user1";
            var events = new List<Event>
            {
                new Event { Id = "1", Name = "Event 1", UserId = userId, EventGroupId = null, Date = "2025-12-01" },
                new Event { Id = "2", Name = "Event 2", UserId = userId, EventGroupId = null, Date = "2025-12-02" },
                new Event { Id = "3", Name = "Event 3", UserId = "user2", EventGroupId = null, Date = "2025-12-03" },
                new Event { Id = "4", Name = "Event 4", UserId = userId, EventGroupId = "group1", Date = "2025-12-04" }
            };

            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(events.BuildMock());

            

            var result = await _eventService.GetEventByUserIdAsync(userId);

            
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result[0].Name, Is.EqualTo("Event 1"));
            Assert.That(result[1].Name, Is.EqualTo("Event 2"));
        }

        [Test]
        public void GetEventByUserIdAsyncUserWithNoEventsShouldThrowException()
        {
            
            var userId = "user1";
            var events = new List<Event>
            {
                new Event { Id = "1", Name = "Event 1", UserId = "user2", EventGroupId = null, Date = "2025-12-01" }
            };

            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(events.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventService.GetEventByUserIdAsync(userId));

            Assert.That(ex.Message, Is.EqualTo("Nincs a felhasználóhoz tartozó esemény."));
        }


        [Test]
        public async Task UpdateEventAsyncValidUpdateShouldUpdateEvent()
        {
            
            var eventId = "event1";
            var userId = "user1";
            var existingEvent = new Event
            {
                Id = eventId,
                Name = "Old Name",
                UserId = userId,
                Date = "2025-12-01"
            };

            var updateDto = new EventCreateDto
            {
                Name = "New Name",
                UserId = userId,
                Date = "2025-12-05",
                Metadata = new List<string> { "updated" }
            };

            var eventList = new List<Event> { existingEvent };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            _mockEventRepository.Setup(r => r.Update(It.IsAny<Event>()))
                .ReturnsAsync((Event e) => e);

            
            var result = await _eventService.UpdateEventAsync(updateDto, eventId);

            
            Assert.That(result, Is.Not.Null);
            _mockEventRepository.Verify(r => r.Update(It.IsAny<Event>()), Times.Once);
        }

        [Test]
        public void UpdateEventAsyncNonExistentEventShouldThrowException()
        {
            
            var eventId = "nonexistent";
            var updateDto = new EventCreateDto
            {
                Name = "New Name",
                UserId = "user1",
                Date = "2025-12-01"
            };

            var emptyEventList = new List<Event>();
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(emptyEventList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventService.UpdateEventAsync(updateDto, eventId));

            Assert.That(ex.Message, Is.EqualTo("Esemény nem található"));
        }

        [Test]
        public void UpdateEventAsyncWrongUserIdShouldThrowException()
        {
            
            var eventId = "event1";
            var existingEvent = new Event
            {
                Id = eventId,
                Name = "Event",
                UserId = "user1",
                Date = "2025-12-01"
            };

            var updateDto = new EventCreateDto
            {
                Name = "Updated",
                UserId = "user2", 
                Date = "2025-12-01"
            };

            var eventList = new List<Event> { existingEvent };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventService.UpdateEventAsync(updateDto, eventId));

            Assert.That(ex.Message, Is.EqualTo("Esemény nem a bejelentkezett felhasználóhoz tartozik"));
        }



        [Test]
        public async Task DeleteAsyncValidEventShouldDeleteSuccessfully()
        {
            

            var eventId = "event1";
            var userId = "user1";
            var existingEvent = new Event
            {
                Id = eventId,
                Name = "Event",
                UserId = userId,
                Date = "2025-12-01"
            };

            var eventList = new List<Event> { existingEvent };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            _mockEventRepository.Setup(r => r.DeleteById(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

           
            await _eventService.DeleteAsync(userId, eventId);

            
            _mockEventRepository.Verify(r => r.DeleteById(eventId), Times.Once);
        }

        [Test]
        public void DeleteAsyncNonExistentEventShouldThrowException()
        {
            
            var eventId = "nonexistent";
            var userId = "user1";
            var emptyEventList = new List<Event>();
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(emptyEventList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventService.DeleteAsync(userId, eventId));

            Assert.That(ex.Message, Is.EqualTo("Esemény nem található"));
        }

        [Test]
        public void DeleteAsyncWrongUserIdShouldThrowException()
        {
            
            var eventId = "event1";
            var existingEvent = new Event
            {
                Id = eventId,
                Name = "Event",
                UserId = "user1",
                Date = "2025-12-01"
            };

            var eventList = new List<Event> { existingEvent };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventService.DeleteAsync("user2", eventId)); 


            Assert.That(ex.Message, Is.EqualTo("Esemény nem a bejelentkezett felhasználóhoz tartozik"));
        }
    }
}
