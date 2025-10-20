using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Participant
{
    public class ParticipantCreateDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string EventId { get; set; }

        [Required]
        public string? Metadata { get; set; }
    }
}
