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
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(User).Assembly);
        }

    }
}
