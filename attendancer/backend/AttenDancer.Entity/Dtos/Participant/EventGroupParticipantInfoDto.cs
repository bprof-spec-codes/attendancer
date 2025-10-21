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

        public List<DateTime>? DateTimes { get; set; }

        public Dictionary<string, string>? Metadata { get; set; }

    }
}
