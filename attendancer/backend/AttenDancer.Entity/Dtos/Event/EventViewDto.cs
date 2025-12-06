using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Event
{
    public class EventViewDto
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required] 
        public string Id { get; set; } = null!;

        [Required]
        public string Date { get; set; } = null!;

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public string? QrCode { get; set; } = null!;

        [Required]
        public bool IsQrValid { get; set; } = true;

        [Required]
        public List<string>? Metadata { get; set; }

        public string? EventGroupName { get; set; }

        public string? EventGroupId { get; set; }

        [Required]
        public ICollection<ParticipantViewDto>? Participants { get; set; } = new List<ParticipantViewDto>();
    }
}
