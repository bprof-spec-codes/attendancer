using AttenDancer.Entity.Entity_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AttenDancer.Entity.Entity_Configurations
{
    internal class EventGroupConfiguration : IEntityTypeConfiguration<EventGroup>
    {
        public void Configure(EntityTypeBuilder<EventGroup> builder)
        {
            builder.Property(eg => eg.Name).HasMaxLength(100);

            builder.HasOne(eg => eg.User)
                .WithMany(u => u.EventGroups)
                .HasForeignKey(eg => eg.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}

