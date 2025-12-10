using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Dtos.User;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Helper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Services
{
    public class UserService
    {

        private readonly IRepository<User> _userRepository;
        private readonly AuthService _authService;
        private readonly DtoProvider _dtoProvider;
        private readonly IRepository<Participant> _participantRepository;

        public UserService(IRepository<User> userRepository, AuthService authService, DtoProvider dtoProvider, IRepository<Participant> participantRepository)
        {
            _userRepository = userRepository;
            _authService = authService;
            _dtoProvider = dtoProvider;
            _participantRepository = participantRepository;
        }


        public async Task<User> RegisterAsync(string firstName, string lastName, string email, string password)
        {
            string normalizedEmail = email.ToLower();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var activeUserExists = await _userRepository.GetAll()
                .AnyAsync(u => u.Email == normalizedEmail && !u.IsDeleted);

            if (activeUserExists)
            {
                throw new Exception("Ez az email cím már regisztrálva van");
            }

            var deletedUser = await _userRepository.GetAll()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail && u.IsDeleted);

            if (deletedUser != null)
            {
                deletedUser.IsDeleted = false;
                deletedUser.DeletedAt = null;
                deletedUser.FirstName = firstName;
                deletedUser.LastName = lastName;
                deletedUser.Password = hashedPassword;
                deletedUser.Email = normalizedEmail;

                return await _userRepository.Update(deletedUser);
            }

            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = normalizedEmail,
                Password = hashedPassword
            };

            return await _userRepository.Create(user);
        }

        public async Task<User> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted)
                .FirstOrDefaultAsync(u => u.Email == email.ToLower());

            if (user == null)
            {
                throw new Exception("Hibás email vagy jelszó");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);

            if (!isPasswordValid)
            {
                throw new Exception("Hibás email vagy jelszó");
            }

            return user;
        }


        public async Task<UserResponseDto> GetByIdAsync(string id)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                throw new Exception("Felhasználó nem található");
            }
            return _dtoProvider.Mapper.Map<UserResponseDto>(user);
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted)
                .ToListAsync();

            return _dtoProvider.Mapper.Map<List<UserResponseDto>>(users);
        }

        public async Task<UserResponseDto> UpdateAsync(string id, UserUpdateDto updateDto)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();


            if (user == null)
            {
                throw new Exception("Felhasználó nem található");
            }

            if (user.Email != updateDto.Email.ToLower())
            {
                var emailExists = await _userRepository.GetAll()
                    .Where(u => !u.IsDeleted)
                    .AnyAsync(u => u.Email == updateDto.Email.ToLower() && u.Id != id);
                if (emailExists)
                {
                    throw new Exception("Ez az email cím már használatban van");
                }
            }

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.Email = updateDto.Email.ToLower();

            var updatedUser = await _userRepository.Update(user);
            return _dtoProvider.Mapper.Map<UserResponseDto>(updatedUser);
        }




        public async Task<UserResponseDto> UpdateUserNameAsync(string id, UserUpdateNameDto updateDto)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();


            if (user == null)
            {
                throw new Exception("Felhasználó nem található");
            }


            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;

            var updatedUser = await _userRepository.Update(user);
            return _dtoProvider.Mapper.Map<UserResponseDto>(updatedUser);
        }

        public async Task<UserResponseDto> UpdateEmailAsync(string id, UserUpdateEmailDto updateDto)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();


            if (user == null)
            {
                throw new Exception("Felhasználó nem található");
            }

            if (user.Email != updateDto.Email.ToLower())
            {
                var emailExists = await _userRepository.GetAll()
                    .Where(u => !u.IsDeleted)
                    .AnyAsync(u => u.Email == updateDto.Email.ToLower() && u.Id != id);
                if (emailExists)
                {
                    throw new Exception("Ez az email cím már használatban van");
                }
            }

            user.Email = updateDto.Email.ToLower();

            var updatedUser = await _userRepository.Update(user);
            return _dtoProvider.Mapper.Map<UserResponseDto>(updatedUser);
        }


        public async Task ChangePasswordAsync(string id, UserChangePassword changePasswordDto)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();

            if (user == null) 
            {
                throw new Exception("Felhasználó nem található");
            }

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(changePasswordDto.OldPassword, user.Password);
            if (!isOldPasswordValid)
            {
                throw new Exception("A beírt jelenlegi jelszó helytelen.");
            }

           string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

            user.Password = newHashedPassword;

            
            await _userRepository.Update(user);
        }


        public async Task DeleteAsync(string id)
        {
            var user = await _userRepository.GetAll()
                .Where(u => !u.IsDeleted && u.Id == id)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                throw new Exception("Felhasználó nem található");
            }


            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;

            await _userRepository.Update(user);




        }


        public async Task<List<EventSignedByUserViewDto>> GetSignedSheetsAsync(string userId)
        {
            var userExists = await _userRepository.GetAll()
                .AnyAsync(u => u.Id == userId && !u.IsDeleted);

            if (!userExists)
            {
                throw new Exception("Felhasználó nem található");
            }

            return await _participantRepository.GetAll()
                .Where(p => p.UserId == userId)
                .Include(p => p.Event)
                    .ThenInclude(e => e.EventGroup)
                .OrderByDescending(p => p.Date)
                .Select(p => new EventSignedByUserViewDto
                {
                    Id = p.Event.Id,
                    Name = p.Event.Name,
                    SignedAt = p.Date,
                    EventGroupName = p.Event.EventGroup != null ? p.Event.EventGroup.Name : null,
                    EventGroupId = p.Event.EventGroup != null ? p.Event.EventGroup.Id : null,
                    EventDate = p.Event.Date,
                    IsQrValid = p.Event.IsQrValid
                })
                .ToListAsync();
        }



    }
}
