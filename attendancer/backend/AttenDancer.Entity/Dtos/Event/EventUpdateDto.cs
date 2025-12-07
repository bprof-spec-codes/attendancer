using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Event
{
    public class EventUpdateDto
    {
        public string Id { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        public string? UserId { get; set; }
        public string? EventGroupId { get; set; }

        [Required]
        public string Date { get; set; } = null!;

        public List<string>? Metadata { get; set; } = new List<string>();

    }
}
