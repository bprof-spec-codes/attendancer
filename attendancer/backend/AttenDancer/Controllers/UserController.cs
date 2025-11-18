using AttenDancer.Entity.Dtos.User;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AttenDancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserService _userService;
        private readonly AuthService _authService;

        public UserController(UserService userService, AuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            try
            {
                var user = await _userService.RegisterAsync(
                    dto.FirstName,
                    dto.LastName,
                    dto.Email,
                    dto.Password
                );

                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            try
            {
                var user = await _userService.LoginAsync(dto.Email, dto.Password);

                var token = _authService.GenerateJwtToken(user);

                /*
                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email
                });
                */
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {

                var user = await _userService.GetByIdAsync(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers() 
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDto dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized(new { message = "Érvénytelen token" });
                }

                var updatedUser = await _userService.UpdateAsync(userId, dto);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpPut("/password")]
        public async Task<IActionResult> ChangePassword([FromBody] UserChangePassword dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized(new { message = "Érvénytelen token" });
                }

                await _userService.ChangePasswordAsync(userId, dto);
                return Ok(new { message = "Jelszó sikeresen megváltoztatva" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized(new { message = "Érvénytelen token" });
                }

                await _userService.DeleteAsync(userId);
                return Ok(new { message = "Felhasználó sikeresen törölve" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized(new { message = "Érvénytelen token" });
                }

                var user = await _userService.GetByIdAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
