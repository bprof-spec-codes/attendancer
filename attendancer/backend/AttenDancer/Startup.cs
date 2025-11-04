using System.Text;
using AttenDancer.Data;
using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Helpers;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AttenDancer;

public class Startup(IConfiguration configuration)
{
    public IConfiguration Configuration { get; } = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });

        services.AddControllers(opt =>
        {
            opt.Filters.Add<ExceptionFilter>();
            opt.Filters.Add<ValidationFilter>();
        });

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

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidAudience = Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
            };
        });


        services.AddOpenApiDocument();

        services.AddTransient<IRepository<User>, Repository<User>>();
        services.AddTransient<IRepository<Event>, Repository<Event>>();
        services.AddTransient<IRepository<EventGroup>, Repository<EventGroup>>();
        services.AddTransient<IRepository<Participant>, Repository<Participant>>();


        services.AddScoped<AuthService>();
        services.AddScoped<UserService>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi();
        }

        app.UseCors("AllowOrigin");

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

    }
}