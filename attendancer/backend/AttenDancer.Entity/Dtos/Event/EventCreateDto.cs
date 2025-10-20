using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Event
{
    public class EventCreateDto
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string? Metadata { get; set; }

        [Required]
        public string? EventGroupId { get; set; }
    }
}
