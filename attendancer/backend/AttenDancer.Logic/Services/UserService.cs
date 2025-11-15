using AttenDancer.Data.Repositories;
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

        public UserService(IRepository<User> userRepository, AuthService authService, DtoProvider dtoProvider)
        {
            _userRepository = userRepository;
            _authService = authService;
            _dtoProvider = dtoProvider;
        }


        public async Task<User> RegisterAsync(string firstName, string lastName, string email, string password)
        {

            var exists = await _userRepository.GetAll()
                .FirstOrDefaultAsync(u => u.Email == email.ToLower());


            if (exists != null)
            {
                if (!exists.IsDeleted)
                {
                    throw new Exception("Ez az email cím már regisztrálva van");
                }


                exists.IsDeleted = false;
                exists.DeletedAt = null;
                exists.FirstName = firstName;
                exists.LastName = lastName;
                exists.Password = BCrypt.Net.BCrypt.HashPassword(password);

                return await _userRepository.Update(exists);


            }


            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);


            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email.ToLower(),
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
                throw new Exception("A jelenlegi jelszó helytelen");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

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

    }
}
