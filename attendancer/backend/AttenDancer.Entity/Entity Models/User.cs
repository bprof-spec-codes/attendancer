using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Entity_Models
{
    public class User : IIdEntity
    {
        

        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }



        public virtual ICollection<EventGroup> EventGroups { get; set; } = new List<EventGroup>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
        public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
    }
}
