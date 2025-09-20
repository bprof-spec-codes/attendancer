using AttenDancer.Data;
using AttenDancer.Entities;
using AttenDancer.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AttenDancer;

public class Startup(IConfiguration configuration)
{
    public IConfiguration Configuration { get; } = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();

        string conString = Configuration.GetConnectionString("AttenDancerDb") ??
            throw new InvalidOperationException("Connection string 'AttenDancerDb'" + " not found.");
        services.AddDbContext<AttenDancerDbContext>(options =>
            options.UseSqlServer(conString));

        services.AddCors(options =>
        {
            options.AddPolicy(
                name: "AllowOrigin",
                builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
        });

        services.AddTransient<AttenDancerDbContext>();
        services.AddTransient<IRepository<Employee>, Repository<Employee>>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            // Swagger
        }

        app.UseCors("AllowOrigin");

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}