using AttenDancer.Entity.Entity_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AttenDancer.Entity.Entity_Configurations
{
    internal class ParticipantConfiguration : IEntityTypeConfiguration<Participant>
    {
        public void Configure(EntityTypeBuilder<Participant> builder)
        {
            builder.HasOne(p => p.User)
                   .WithMany(u => u.Participants)
                   .HasForeignKey(p => p.UserId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(p => p.Event)
                .WithMany(e => e.Participants)
                .HasForeignKey(p => p.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(p => new { p.UserId, p.EventId }).IsUnique();
            builder.Ignore(p => p.MetadataDict);
        }
    }
}

