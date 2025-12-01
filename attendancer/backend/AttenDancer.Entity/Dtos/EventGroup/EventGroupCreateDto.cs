using AttenDancer.Entity.Entity_Models;
using System.ComponentModel.DataAnnotations;


namespace AttenDancer.Entity.Dtos.EventGroup
{
    public class EventGroupCreateDto
    {
        [Required]
        public List<string> EventIds { get; set; } = new List<string>();

        [Required]
        public string Name { get; set; } = null!;

        public string? UserId { get; set; }

        public List<string>? Metadata { get; set; } = new List<string>();
    }
}
