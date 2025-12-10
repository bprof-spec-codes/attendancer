using AttenDancer.Data;
using AttenDancer.Data.Repositories;
using AttenDancer.Entity.Entity_Models;
using AttenDancer.Helpers;
using AttenDancer.Logic.Helper;
using AttenDancer.Logic.Interfaces;
using AttenDancer.Logic.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

        string conString = Configuration["db:conn"] ??
            throw new InvalidOperationException("Connection string 'AttenDancerDb'" + " not found.");

        services.AddDbContext<AttenDancerDbContext>(options =>
            options.UseLazyLoadingProxies()
            .UseSqlServer(conString));

        services.AddCors(options =>
        {
            options.AddPolicy(
                name: "AllowOrigin",
                builder =>
                {
                    var frontendUrl = Configuration["settings:frontend"] ?? "http://localhost:4200/";

                    //builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();

                    builder.WithOrigins("https://attendancer.hu")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
            );
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


        services.AddOpenApiDocument(config =>
        {
            config.AddSecurity("JWT", new NSwag.OpenApiSecurityScheme
            {
                Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = NSwag.OpenApiSecurityApiKeyLocation.Header,
                Description = "Írd be ide: Bearer TOKEN"
            });

            config.OperationProcessors.Add(
                new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        services.AddControllers();
        services.AddTransient<IRepository<User>, Repository<User>>();
        services.AddTransient<IRepository<Event>, Repository<Event>>();
        services.AddTransient<IRepository<EventGroup>, Repository<EventGroup>>();
        services.AddTransient<IRepository<Participant>, Repository<Participant>>();

        services.AddScoped<DtoProvider>();
        services.AddScoped<AuthService>();
        services.AddScoped<UserService>();
        services.AddScoped<ParticipantService>();
        services.AddScoped<EventService>();
        services.AddScoped<EventGroupService>();
        services.AddScoped<QrService>();
        services.AddScoped<DtoProvider>();
        services.AddScoped<IEmailService, EmailService>();
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
        app.UseMiddleware<ActiveUserMiddleware>();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        
    }
}