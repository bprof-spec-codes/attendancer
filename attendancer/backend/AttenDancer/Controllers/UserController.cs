using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AttenDancer.Entity.Dtos.User;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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


                return Ok(new { token });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpPut("changepassword")]
        public async Task<IActionResult> ChangePassword([FromBody] UserChangePasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("A token nem tartalmaz érvényes azonosítót.");
            }

            try
            {
                var user = await _userService.ChangePasswordAsync(userId, dto.OldPassword, dto.NewPassword);

                return Ok(new { message = "Jelszó módosítása sikeres." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("changeprofile")]
        public async Task<IActionResult> ChangeProfile([FromBody] UserChangeProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("A token nem tartalmaz érvényes azonosítót.");
            }

            try
            {
                var user = await _userService.ChangeProfileAsync(userId, dto.FirstName, dto.LastName, dto.Email);

                return Ok(new { message = "Felhasználó módosítása sikeres." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
