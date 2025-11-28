using AttenDancer.Data.Repositories;
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
    public class UserServiceTests
    {
        private Mock<IRepository<User>> _mockUserRepository;
        private Mock<IRepository<Participant>> _mockParticipantRepository;
        private Mock<AuthService> _mockAuthService;
        private Mock<DtoProvider> _mockDtoProvider;
        private UserService _userService;




        [SetUp]
        public void Setup()
        {
            _mockUserRepository = new Mock<IRepository<User>>();
            _mockParticipantRepository = new Mock<IRepository<Participant>>();
            _mockAuthService = new Mock<AuthService>();
            _mockDtoProvider = new Mock<DtoProvider>();

            _userService = new UserService(

                _mockUserRepository.Object,
                null,
                null,
                _mockParticipantRepository.Object

            );
        }


        [Test]
        public async Task RegisterAsync_NewUser_ShouldCreateUserSuccessfully()
        {
            
            var email = "test@example.com";
            var firstName = "Test";
            var lastName = "User";
            var password = "password123";


            var emptyUserList = new List<User>();
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(emptyUserList.BuildMock());

            _mockUserRepository.Setup(r => r.Create(It.IsAny<User>()))
                .ReturnsAsync((User u) => u);


            var result = await _userService.RegisterAsync(firstName, lastName, email, password);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo(email.ToLower()));
            Assert.That(result.FirstName, Is.EqualTo(firstName));
            Assert.That(result.LastName, Is.EqualTo(lastName));

            _mockUserRepository.Verify(r => r.Create(It.IsAny<User>()), Times.Once);

        }


        [Test]
        public async Task RegisterAsync_DuplicateEmail_ShouldThrowException()
        {
            
            var email = "existing@example.com";
            var existingUser = new User
            {
                Id = "1",
                Email = email.ToLower(),
                FirstName = "Existing",
                LastName = "User",
                IsDeleted = false
            };

            var userList = new List<User> { existingUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _userService.RegisterAsync("New", "User", email, "password123"));

            Assert.That(ex.Message, Is.EqualTo("Ez az email cím már regisztrálva van"));
        }

        [Test]
        public async Task RegisterAsync_SoftDeletedUser_ShouldReactivateUser()
        {
            
            var email = "deleted@example.com";
            var deletedUser = new User
            {
                Id = "1",
                Email = email.ToLower(),
                FirstName = "Old",
                LastName = "Name",
                Password = "oldhash",
                IsDeleted = true,
                DeletedAt = DateTime.UtcNow.AddDays(-10)
            };

            var userList = new List<User> { deletedUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());

            _mockUserRepository.Setup(r => r.Update(It.IsAny<User>()))
                .ReturnsAsync((User u) => u);

           
            var result = await _userService.RegisterAsync("New", "Name", email, "newpassword");

            
            Assert.That(result, Is.Not.Null);
            Assert.That(result.IsDeleted, Is.False);
            Assert.That(result.DeletedAt, Is.Null);
            Assert.That(result.FirstName, Is.EqualTo("New"));
            Assert.That(result.LastName, Is.EqualTo("Name"));
            _mockUserRepository.Verify(r => r.Update(It.IsAny<User>()), Times.Once);
        }

    }
}
