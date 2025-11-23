using AttenDancer.Entity.Dtos.User;
using AttenDancer.Logic.Interfaces;
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
        private readonly IEmailService _emailService;

        public UserController(UserService userService, AuthService authService, IEmailService emailService)
        {
            _userService = userService;
            _authService = authService;
            _emailService = emailService;
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

                var confirmUrl = $"https://www.youtube.com/shorts/Ay8lynMZ4mE";

                var placeholders = new Dictionary<string, string>
                {
                    ["USERNAME"] = $"{user.FirstName} {user.LastName}",
                    ["EMAIL"] = user.Email,
                    ["CONFIRM_URL"] = confirmUrl
                };

                await _emailService.SendTemplateEmailAsync(
                    to: user.Email,
                    subject: "Sikeres regisztráció",
                    templateName: "registration",
                    placeholders: placeholders
                );

                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    emailSent = true
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


        [Authorize]
        [HttpGet("me/signed-sheets")]
        public async Task<IActionResult> GetMySignedSheets()
        {
            try
            {

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized(new { message = "Érvénytelen token" });
                }

                var signedSheets = await _userService.GetSignedSheetsAsync(userId);
                return Ok(signedSheets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
