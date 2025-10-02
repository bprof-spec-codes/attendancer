using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Entity_Models
{
    public class Event : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = null!;
        public string QrCode { get; set; } = null!;

        public string? Metadata { get; set; }

        
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        
        public string EventGroupId { get; set; }
        public EventGroup EventGroup { get; set; }

        
        public ICollection<Participant> Participants { get; set; } = new List<Participant>();
    }
}
