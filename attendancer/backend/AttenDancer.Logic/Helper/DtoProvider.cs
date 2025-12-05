using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Dtos.Event;
using AttenDancer.Entity.Dtos.EventGroup;
using AttenDancer.Entity.Dtos.Participant;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Entity.Dtos.User;
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
        private readonly IRepository<User> _userRepository;

        public DtoProvider(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<EventCreateDto, Event>();
                cfg.CreateMap<EventUpdateDto, Event>();

                cfg.CreateMap<Participant, ParticipantViewDto>()
                   .AfterMap((src, dest) =>
                   {
                       dest.UserFullName = $"{src.User?.LastName} {src.User?.FirstName}";
                       dest.MetadataDictionary = src.MetadataDict;
                       dest.Date = src.Date;
                   });

                cfg.CreateMap<Event, EventViewDto>()
                   .AfterMap((src, dest) =>
                   {
                       dest.EventGroupName = src.EventGroup != null ? src.EventGroup.Name : "Nincs csoportja";
                   });

                cfg.CreateMap<ParticipantCreateDto, Participant>();
                cfg.CreateMap<EventGroupCreateDto, EventGroup>();
                cfg.CreateMap<EventGroup, EventGroupViewDto>();
                cfg.CreateMap<EventGroup, EventGroupParticipantInfoDto>()
                    .AfterMap((src, dest, context) =>
                    {
                        context.Items.TryGetValue("userId", out var getuserId);
                        string userId = getuserId as string;
                        int count = src.Events.Count(ev => ev.Participants.Any(p => p.UserId == userId));
                        var Participant = src.Events.SelectMany(ev => ev.Participants)
                                                     .Where(p => p.UserId == userId)
                                                     .Where(p => p != null);
                        User user = _userRepository.GetAll().FirstOrDefault(u => u.Id == userId);

                        dest.EventCount = count;

                        dest.UserName = $"{user.LastName} " +
                              $"{user.FirstName}";

                        dest.Metadata = count != 0 ? Participant.Select(p => p.MetadataDict).FirstOrDefault()
                                                    : new Dictionary<string, string>();

                        List<DateTime> dates = Participant.Select(p => p.Date).ToList();
                        List<string> present = Participant.Select(p => p.EventId).ToList();

                        if (present.Count > 0)
                        {
                            for (int i = 0; i < present.Count; i++)
                            {
                                dest.Present.Add(present[i], dates[i]);
                            }
                        }
                        else
                        {
                            dest.Present = new Dictionary<string, DateTime>();
                        }
                    });
                cfg.CreateMap<User, UserResponseDto>();
                cfg.CreateMap<UserUpdateDto, User>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore())
                    .ForMember(dest => dest.Password, opt => opt.Ignore())
                    .ForMember(dest => dest.EventGroups, opt => opt.Ignore())
                    .ForMember(dest => dest.Events, opt => opt.Ignore())
                    .ForMember(dest => dest.Participants, opt => opt.Ignore());
            });
            Mapper = new Mapper(config);
        }

    }
}
