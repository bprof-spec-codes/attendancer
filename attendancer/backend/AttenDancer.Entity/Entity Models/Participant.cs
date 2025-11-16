using AttenDancer.Entity.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Entity_Models
{
    public class Participant : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string UserId { get; set; } = null!;
        public virtual User User { get; set; } = null!;

        public string EventId { get; set; } = null!;

        [JsonIgnore]
        public virtual Event Event { get; set; } = null!;

        public DateTime Date { get; set; } = DateTime.UtcNow;

        public string? Metadata { get; set; }

        [NotMapped]
        public Dictionary<string, string> MetadataDict
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Metadata))
                    return new Dictionary<string, string>();

                try
                {
                    return JsonSerializer.Deserialize<Dictionary<string, string>>(Metadata)
                           ?? new Dictionary<string, string>();
                }
                catch
                {

                    return new Dictionary<string, string>();
                }
            }
            set
            {
                if (value == null || value.Count == 0)
                {
                    Metadata = null;
                }
                else
                {
                    Metadata = JsonSerializer.Serialize(value);
                }
            }
        }
    }
}
