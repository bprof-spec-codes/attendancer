using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.EventGroup
{
    public class EventGroupMatrixViewDto
    {
        public string EventGroupId { get; set; } = null!;
        public string EventGroupName { get; set; } = null!;
        public List<MatrixEventColumnDto> Events { get; set; } = new();
        public List<MatrixParticipantRowDto> Participants { get; set; } = new();

    }

    public class MatrixEventColumnDto 
    {
        public string EventId { get; set; } = null!;
        public string EventName { get; set; } = null!;
    }

    public class MatrixParticipantRowDto
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public Dictionary<string, bool> Attendances { get; set; } = new();
    }
}
