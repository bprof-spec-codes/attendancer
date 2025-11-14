using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Entity_Models
{
    public class EventGroup : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = null!;

        
        public string UserId { get; set; } = null!;
        public virtual User User { get; set; } = null!;

        
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
