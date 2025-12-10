using AttenDancer.Data;
using Microsoft.EntityFrameworkCore;

namespace AttenDancer;

public class Program
{
    public static void Main(string[] args)
    {
        // CreateHostBuilder(args).Build().Run();

        var host = CreateHostBuilder(args).Build();
        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<AttenDancerDbContext>();
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while migrating the database.");
                throw;
            }
        }

        host.Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureKestrel((context, options) =>
                {
                    if (context.HostingEnvironment.IsProduction())
                    {
                        var port = int.Parse(context.Configuration["settings:port"] ?? "7198");
                        options.ListenAnyIP(7198);
                    }
                });

                webBuilder.UseStartup<Startup>();
            });
}