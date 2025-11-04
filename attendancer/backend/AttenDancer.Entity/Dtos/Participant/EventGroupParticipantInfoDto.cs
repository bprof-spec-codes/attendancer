using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Participant
{
    public class EventGroupParticipantInfoDto
    {
        public string UserName { get; set; }
        public int EventCount { get; set; }

        public Dictionary<string, DateTime> Present { get; set; } = new Dictionary<string, DateTime>(); // EventId, Date

        public Dictionary<string, string>? Metadata { get; set; }

    }
}
