using AttenDancer.Entities;
using Microsoft.EntityFrameworkCore;

namespace AttenDancer.Data;
public class AttenDancerDbContext : DbContext
{
    public DbSet<Employee> Employees { get; private set; }

    public AttenDancerDbContext(DbContextOptions<AttenDancerDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Employee>().HasData(
            [
                new()
                {
                    Id = 1,
                    FullName = "Kai Le",
                    Age = 47,
                    JobTitle = "Controls Engineer"
                },
                new()
                {
                    Id = 2,
                    FullName = "Robert Patel",
                    Age = 38,
                    JobTitle = "Analyst"
                },
                new()
                {
                    Id = 3,
                    FullName = "Cameron Lo",
                    Age = 52,
                    JobTitle = "Network Administrator"
                },
                new()
                {
                    Id = 4,
                    FullName = "Harper Castillo",
                    Age = 44,
                    JobTitle = "Director"
                }
            ]);
    }
}
