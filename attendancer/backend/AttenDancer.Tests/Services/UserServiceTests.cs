using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.User;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using AttenDancer.Logic.Services;
using MockQueryable;
using Moq;

namespace AttenDancer.Tests.Services
{
    [TestFixture]
    public class UserServiceTests
    {
        private Mock<IRepository<User>> _mockUserRepository;
        private Mock<IRepository<Participant>> _mockParticipantRepository;
        
        private UserService _userService;




        [SetUp]
        public void Setup()
        {
            _mockUserRepository = new Mock<IRepository<User>>();
            _mockParticipantRepository = new Mock<IRepository<Participant>>();
            

            _userService = new UserService(

                _mockUserRepository.Object,
                null!,
                null!,
                _mockParticipantRepository.Object

            );
        }


        [Test]
        public async Task RegisterAsyncNewUserShouldCreateUserSuccessfully()
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
        public void RegisterAsyncDuplicateEmailShouldThrowException()
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
        public async Task RegisterAsyncSoftDeletedUserShouldReactivateUser()
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


        [Test]
        public async Task LoginAsyncValidCredentialsShouldReturnUser()
        {

            var email = "user@example.com";
            var password = "correctpassword";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var existingUser = new User
            {
                Id = "1",
                Email = email.ToLower(),
                Password = hashedPassword,
                FirstName = "Test",
                LastName = "User",
                IsDeleted = false
            };

            var userList = new List<User> { existingUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());



            var result = await _userService.LoginAsync(email, password);



            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo(email.ToLower()));
            Assert.That(result.Id, Is.EqualTo("1"));
        }


        [Test]
        public void LoginAsyncInvalidPasswordShouldThrowException()
        {

            var email = "user@example.com";
            var correctPassword = "correctpassword";
            var wrongPassword = "wrongpassword";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(correctPassword);

            var existingUser = new User
            {
                Id = "1",
                Email = email.ToLower(),
                Password = hashedPassword,
                IsDeleted = false
            };

            var userList = new List<User> { existingUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());



            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _userService.LoginAsync(email, wrongPassword));

            Assert.That(ex.Message, Is.EqualTo("Hibás email vagy jelszó"));
        }



        [Test]
        public void LoginAsyncNonExistentUserShouldThrowException()
        {

            var email = "nonexistent@example.com";
            var password = "anypassword";

            var emptyUserList = new List<User>();
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(emptyUserList.BuildMock());


            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _userService.LoginAsync(email, password));

            Assert.That(ex.Message, Is.EqualTo("Hibás email vagy jelszó"));
        }


        [Test]
        public async Task ChangePasswordAsyncValidOldPasswordShouldUpdatePassword()
        {
            

            var userId = "1";
            var oldPassword = "oldpassword123";
            var newPassword = "newpassword456";
            var hashedOldPassword = BCrypt.Net.BCrypt.HashPassword(oldPassword);

            var existingUser = new User
            {
                Id = userId,
                Email = "user@example.com",
                Password = hashedOldPassword,
                FirstName = "Test",
                LastName = "User",
                IsDeleted = false
            };


            var userList = new List<User> { existingUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());

            _mockUserRepository.Setup(r => r.Update(It.IsAny<User>()))
                .ReturnsAsync((User u) => u);

            var changePasswordDto = new UserChangePassword
            {
                OldPassword = oldPassword,
                NewPassword = newPassword
            };

            
            await _userService.ChangePasswordAsync(userId, changePasswordDto);


            _mockUserRepository.Verify(r => r.Update(It.Is<User>(u => u.Id == userId)), Times.Once);

        }



        [Test]
        public void ChangePasswordAsyncInvalidOldPasswordShouldThrowException()
        {
            
            var userId = "1";
            var correctOldPassword = "correctpassword";
            var wrongOldPassword = "wrongpassword";
            var newPassword = "newpassword456";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(correctOldPassword);

            var existingUser = new User
            {
                Id = userId,
                Email = "user@example.com",
                Password = hashedPassword,
                IsDeleted = false
            };

            var userList = new List<User> { existingUser };
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(userList.BuildMock());

            var changePasswordDto = new UserChangePassword
            {
                OldPassword = wrongOldPassword,
                NewPassword = newPassword
            };

            

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _userService.ChangePasswordAsync(userId, changePasswordDto));

            Assert.That(ex.Message, Is.EqualTo("A beírt jelenlegi jelszó helytelen."));
        }



        [Test]
        public void ChangePasswordAsyncNonExistentUserShouldThrowException()
        {
           
            var userId = "999";
            var emptyUserList = new List<User>();
            _mockUserRepository.Setup(r => r.GetAll())
                .Returns(emptyUserList.BuildMock());

            var changePasswordDto = new UserChangePassword
            {
                OldPassword = "anypassword",
                NewPassword = "newpassword"

            };

            


            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _userService.ChangePasswordAsync(userId, changePasswordDto));

            Assert.That(ex.Message, Is.EqualTo("Felhasználó nem található"));
        }

    }
}
