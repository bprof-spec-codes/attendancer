using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Entity_Models
{
    public class Event : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = null!;

        public string? QrCodeValue { get; set; } = null!;
        public bool IsQrValid { get; set; } = true;

        public DateTime Date { get; set; }

        //public string? Metadata { get; set; }
        public List<string> Metadata { get; set; } = new List<string>();


        public string UserId { get; set; } = null!;
        public virtual User User { get; set; } = null!;


        public string? EventGroupId { get; set; }
        public virtual EventGroup? EventGroup { get; set; }


        public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
    }
}
