using AttenDancer.Entity.Entity_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AttenDancer.Entity.Entity_Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.Property(e => e.Name).HasMaxLength(150);
            builder.Property(e => e.QrCode).HasMaxLength(500);

            builder.HasOne(e => e.User)
                .WithMany(u => u.Events)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.EventGroup)
                .WithMany(eg => eg.Events)
                .HasForeignKey(e => e.EventGroupId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired(false);

            builder.Property(e => e.Metadata)
                .HasConversion(new ValueConverter<List<string>, string>(        //ValueConverter azért kell, mert nem tudja az EF, hogy a property vagy az 
                v => string.Join(',', v),                                       //adtbázisban az adattag típusa lesz list<string> és csak ezzel tudja megkülönöztetni
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()));

        }
    }
}
