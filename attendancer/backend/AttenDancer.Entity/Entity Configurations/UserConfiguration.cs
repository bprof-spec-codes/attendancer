using AttenDancer.Entity.Entity_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AttenDancer.Entity.Entity_Configurations
{
    internal class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.FirstName).HasMaxLength(50);
            builder.Property(u => u.LastName).HasMaxLength(50);
            builder.Property(u => u.Email).HasMaxLength(100);
            builder.Property(u => u.Password).HasMaxLength(255);
        }
    }
}
