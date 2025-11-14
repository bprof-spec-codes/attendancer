using AttenDancer.Entity.Dtos.User;
using AttenDancer.Logic.Interfaces;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Mvc;

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
    }
}
