using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Entity_Models;
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

        public UserService(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }



        public async Task<User> RegisterAsync(string firstName, string lastName, string email, string password)
        {
            
            var exists = await _userRepository.GetAll()
                .AnyAsync(u => u.Email == email.ToLower());

            if (exists)
            {
                throw new Exception("Ez az email cím már regisztrálva van");
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
    }
}
