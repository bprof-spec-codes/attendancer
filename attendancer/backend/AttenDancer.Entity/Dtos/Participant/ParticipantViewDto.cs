using AttenDancer.Entity.Entity_Models;
using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Participant
{
    public class ParticipantViewDto
    {
        public string UserFullName { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [NotMapped]
        [Required]
        public string? Metadata { get; set; }

        public Dictionary<string, string>? MetadataDictionary { get; set; }
    }
}