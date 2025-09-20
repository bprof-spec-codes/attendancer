using AttenDancer.Data;
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
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            // Swagger
        }

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}