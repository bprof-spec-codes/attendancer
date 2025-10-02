using AttenDancer.Entity.Entity_Models;
using AttenDancer.Entity.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AttenDancer.Data
{
    public class AttenDancerDbContext : DbContext
    {

        public AttenDancerDbContext(DbContextOptions<AttenDancerDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<EventGroup> EventGroups { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Participant> Participants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();

                entity.Property(u => u.FirstName).HasMaxLength(50);
                entity.Property(u => u.LastName).HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(100);
                entity.Property(u => u.Password).HasMaxLength(255);
            });


            modelBuilder.Entity<EventGroup>(entity =>
            {
                entity.Property(eg => eg.Name).HasMaxLength(100);

                entity.HasOne(eg => eg.User)
                    .WithMany(u => u.EventGroups)
                    .HasForeignKey(eg => eg.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            modelBuilder.Entity<Event>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(150);
                entity.Property(e => e.QrCode).HasMaxLength(500);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Events)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.EventGroup)
                    .WithMany(eg => eg.Events)
                    .HasForeignKey(e => e.EventGroupId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .IsRequired(false);
            });


            modelBuilder.Entity<Participant>(entity =>
            {
                entity.HasOne(p => p.User)
                    .WithMany(u => u.Participants)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(p => p.Event)
                    .WithMany(e => e.Participants)
                    .HasForeignKey(p => p.EventId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(p => new { p.UserId, p.EventId }).IsUnique();
                entity.Ignore(p => p.MetadataDict);
            });




            






        }

    }
}
