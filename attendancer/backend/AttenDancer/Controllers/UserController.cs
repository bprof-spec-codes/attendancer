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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            try
            {
                var authenticatedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                
                if (id != authenticatedUserId)
                {
                    return Forbid();
                }

                var updatedUser = await _userService.UpdateAsync(id, dto);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] UserChangePassword dto)
        {
            try
            {
                var authenticatedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                
                if (id != authenticatedUserId)
                {
                    return Forbid();
                }

                await _userService.ChangePasswordAsync(id, dto);
                return Ok(new { message = "Jelszó sikeresen megváltoztatva" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var authenticatedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                
                if (id != authenticatedUserId)
                {
                    return Forbid();
                }

                await _userService.DeleteAsync(id);
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
