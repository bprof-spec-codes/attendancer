using AttenDancer.Entity.Dtos.Event;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.EventGroup
{
    public class EventGroupViewDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public ICollection<EventViewDto> Events { get; set; } = new List<EventViewDto>();
    }
}
