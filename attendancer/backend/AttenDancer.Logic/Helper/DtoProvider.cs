using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Helper
{
    public class DtoProvider
    {
        public Mapper Mapper { get; }

        public DtoProvider()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<EventCreateDto, Event>();

                cfg.CreateMap<Event, EventViewDto>()
                   .AfterMap((src, dest) =>
                   {
                       dest.EventGroupName = src.EventGroup != null ? src.EventGroup.Name : "Nincs csoportja";
                   });

                cfg.CreateMap<Participant, ParticipantViewDto>()
                   .AfterMap((src, dest) =>
                   {
                       dest.UserFullName = $"{src.User.LastName} {src.User.FirstName}";
                       dest.MetadataDictionary = src.Metadata != null
                           ? System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(src.Metadata)
                           : new Dictionary<string, string>();
                   });

                cfg.CreateMap<ParticipantCreateDto, Participant>();
            });
            Mapper = new Mapper(config);
        }

    }
}
