using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.Event
{
    public class EventSignedByUserViewDto
    {

        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime SignedAt { get; set; }
        public string? EventGroupName { get; set; }

        public string? EventGroupId { get; set; }
        
        public bool IsQrValid { get; set; }

    }
}
