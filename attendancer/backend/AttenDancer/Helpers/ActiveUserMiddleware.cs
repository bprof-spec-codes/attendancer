using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Entity_Models;
using System.Security.Claims;

namespace AttenDancer.Helpers
{
    public class ActiveUserMiddleware
    {
        private readonly RequestDelegate _next;

        public ActiveUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IRepository<User> userRepository)
        {
            
            if (context.User.Identity?.IsAuthenticated == true)
            {

                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId != null)
                {

                    var user = await userRepository.GetOne(userId);

                    
                    if (user == null || user.IsDeleted)
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsJsonAsync(new { message = "A felhasználó nem aktív" });
                        return;
                    }
                }

            }

            
            await _next(context);

        }

    }
}
