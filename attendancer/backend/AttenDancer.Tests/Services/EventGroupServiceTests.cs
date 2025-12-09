using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.EventGroup;
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
    public class EventGroupServiceTests
    {
        private Mock<IRepository<EventGroup>> _mockEventGroupRepository;
        private Mock<IRepository<Event>> _mockEventRepository;
        private EventGroupService _eventGroupService;
        private DtoProvider _dtoProvider;


        [SetUp]
        public void Setup()
        {
            _mockEventGroupRepository = new Mock<IRepository<EventGroup>>();
            _mockEventRepository = new Mock<IRepository<Event>>();


            var mockUserRepository = new Mock<IRepository<User>>();
            _dtoProvider = new DtoProvider(mockUserRepository.Object);

            _eventGroupService = new EventGroupService(
                _mockEventGroupRepository.Object,
                _dtoProvider,
                _mockEventRepository.Object

            );

        }



        [Test]
        public async Task CreateEventGroupAsyncValidDtoShouldCreateGroupSuccessfully()
        {
            
            var userId = "user1";
            var event1 = new Event { Id = "event1", Name = "Event 1", UserId = userId, Metadata = new List<string> { "meta1" } };
            var event2 = new Event { Id = "event2", Name = "Event 2", UserId = userId, Metadata = new List<string> { "meta1" } };

            var createDto = new EventGroupCreateDto
            {
                Name = "Test Group",
                UserId = userId,
                EventIds = new List<string> { "event1", "event2" }
            };

            var eventList = new List<Event> { event1, event2 };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            _mockEventGroupRepository.Setup(r => r.Create(It.IsAny<EventGroup>()))
                .ReturnsAsync((EventGroup eg) => eg);

            _mockEventRepository.Setup(r => r.Update(It.IsAny<Event>()))
                .ReturnsAsync((Event e) => e);

            
            var result = await _eventGroupService.CreateEventGroupAsync(createDto);

           

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo(createDto.Name));
            Assert.That(result.UserId, Is.EqualTo(userId));
            _mockEventGroupRepository.Verify(r => r.Create(It.IsAny<EventGroup>()), Times.Once);
            _mockEventRepository.Verify(r => r.Update(It.IsAny<Event>()), Times.Exactly(2));
        }

        [Test]
        public void CreateEventGroupAsyncEmptyEventIdsShouldThrowException()
        {
            
            var createDto = new EventGroupCreateDto
            {
                Name = "Test Group",
                UserId = "user1",
                EventIds = new List<string>() 
            };

            

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.CreateEventGroupAsync(createDto));

            Assert.That(ex.Message, Is.EqualTo("Eseménycsoportnak legalább egy eseményt tartalmaznia kell."));
        }

        [Test]
        public void CreateEventGroupAsyncWrongUserIdInEventsShouldThrowException()
        {
           

            var userId = "user1";
            var event1 = new Event { Id = "event1", Name = "Event 1", UserId = userId };
            var event2 = new Event { Id = "event2", Name = "Event 2", UserId = "user2" };

            var createDto = new EventGroupCreateDto
            {
                Name = "Test Group",
                UserId = userId,
                EventIds = new List<string> { "event1", "event2" }
            };

            var eventList = new List<Event> { event1, event2 };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.CreateEventGroupAsync(createDto));


            Assert.That(ex.Message, Does.Contain("Az eseménycsoport létrehozásához minden eseménynek ugyanahhoz a felhasználóhoz kell tartoznia"));
        }

        [Test]
        public async Task GetEventGroupByIDAsyncValidIdAndUserShouldReturnGroup()
        {
            
            var eventGroupId = "group1";
            var userId = "user1";
            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Test Group",
                UserId = userId
            };

            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());

            
            var result = await _eventGroupService.GetEventGroupByIDAsync(eventGroupId, userId);

            

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(eventGroupId));
            Assert.That(result.Name, Is.EqualTo("Test Group"));
        }

        [Test]
        public void GetEventGroupByIDAsyncInvalidIdShouldThrowException()
        {
            
            var eventGroupId = "nonexistent";
            var userId = "user1";
            var emptyGroupList = new List<EventGroup>();
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(emptyGroupList.BuildMock());

            

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.GetEventGroupByIDAsync(eventGroupId, userId));

            Assert.That(ex.Message, Is.EqualTo("Hibás eseménycsoport azonosító"));
        }

        [Test]
        public void GetEventGroupByIDAsyncWrongUserIdShouldThrowException()
        {
            
            var eventGroupId = "group1";
            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Test Group",
                UserId = "user1"
            };


            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.GetEventGroupByIDAsync(eventGroupId, "user2"));
            

            Assert.That(ex.Message, Is.EqualTo("Eseménycsoportot csak a tulajdonosa kérheti le"));
        }


        [Test]
        public async Task UpdateEventGroupAsyncValidUpdateShouldUpdateGroup()
        {
            

            var eventGroupId = "group1";
            var userId = "user1";


            var oldEvent = new Event { Id = "event1", Name = "Old Event", UserId = userId, EventGroupId = eventGroupId };
            var newEvent = new Event { Id = "event2", Name = "New Event", UserId = userId, EventGroupId = null };

            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Old Name",
                UserId = userId,
                Events = new List<Event> { oldEvent }
            };


            var updateDto = new EventGroupCreateDto
            {
                Name = "Updated Name",
                UserId = userId,
                EventIds = new List<string> { "event2" }
            };



            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());

            var eventList = new List<Event> { oldEvent, newEvent };
            _mockEventRepository.Setup(r => r.GetAll())
                .Returns(eventList.BuildMock());

            _mockEventGroupRepository.Setup(r => r.Update(It.IsAny<EventGroup>()))
                .ReturnsAsync((EventGroup eg) => eg);

            _mockEventRepository.Setup(r => r.Update(It.IsAny<Event>()))
                .ReturnsAsync((Event e) => e);

           
            var result = await _eventGroupService.UpdateEventGroupAsync(eventGroupId, updateDto);

            

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("Updated Name"));
            _mockEventGroupRepository.Verify(r => r.Update(It.IsAny<EventGroup>()), Times.Once);
            _mockEventRepository.Verify(r => r.Update(It.IsAny<Event>()), Times.AtLeastOnce);
        }


        [Test]
        public void UpdateEventGroupAsyncWrongUserIdShouldThrowException()
        {
            
            var eventGroupId = "group1";
            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Test Group",
                UserId = "user1",
                Events = new List<Event>()
            };


            var updateDto = new EventGroupCreateDto
            {
                Name = "Updated Name",
                UserId = "user2",
                EventIds = new List<string> { "event1" }
            };


            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.UpdateEventGroupAsync(eventGroupId, updateDto));

            Assert.That(ex.Message, Is.EqualTo("Eseménycsoportot csak a tulajdonosa tudja módosítani"));
        }


        [Test]
        public async Task DeleteEventGroupAsyncValidDeleteShouldDeleteSuccessfully()
        {
            

            var eventGroupId = "group1";
            var userId = "user1";

            var event1 = new Event { Id = "event1", Name = "Event 1", UserId = userId, EventGroupId = eventGroupId };
            var event2 = new Event { Id = "event2", Name = "Event 2", UserId = userId, EventGroupId = eventGroupId };

            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Test Group",
                UserId = userId,
                Events = new List<Event> { event1, event2 }
            };

            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());


            _mockEventRepository.Setup(r => r.Update(It.IsAny<Event>()))
                .ReturnsAsync((Event e) => e);

            _mockEventGroupRepository.Setup(r => r.DeleteById(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            
            await _eventGroupService.DeleteEventGroupAsync(eventGroupId, userId);

            _mockEventRepository.Verify(r => r.Update(It.IsAny<Event>()), Times.Exactly(2));
            _mockEventGroupRepository.Verify(r => r.DeleteById(eventGroupId), Times.Once);
        }



        [Test]
        public void DeleteEventGroupAsyncWrongUserIdShouldThrowException()
        {
            
            var eventGroupId = "group1";
            var eventGroup = new EventGroup
            {
                Id = eventGroupId,
                Name = "Test Group",
                UserId = "user1",
                Events = new List<Event>()
            };

            var groupList = new List<EventGroup> { eventGroup };
            _mockEventGroupRepository.Setup(r => r.GetAll())
                .Returns(groupList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _eventGroupService.DeleteEventGroupAsync(eventGroupId, "user2"));

            Assert.That(ex.Message, Is.EqualTo("Eseménycsoportot csak a tulajdonosa tudja kitörölni"));
        }

    }
}
