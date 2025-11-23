using System.Security.Claims;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttenDancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventGroupController : ControllerBase
    {
        private readonly EventGroupService _eventGroupService;

        public EventGroupController(EventGroupService eventGroupService)
        {
            _eventGroupService = eventGroupService;
        }

        
    }
}
