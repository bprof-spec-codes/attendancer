using AttenDancer.Entity.Entity_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AttenDancer.Entity.Entity_Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.Property(e => e.Name).HasMaxLength(150);
            builder.Property(e => e.QrCodeValue).HasMaxLength(500);
            builder.Property(e => e.ExpirationDate).IsRequired();

            builder.HasOne(e => e.User)
                .WithMany(u => u.Events)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.EventGroup)
                .WithMany(eg => eg.Events)
                .HasForeignKey(e => e.EventGroupId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired(false);

            var valueComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            builder.Property(e => e.Metadata)
                .HasConversion(new ValueConverter<List<string>, string>(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()))
                .Metadata.SetValueComparer(valueComparer);
        }
    }
}
