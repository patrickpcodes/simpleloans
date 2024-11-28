using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SimpleLoans.Server.Api;
using SimpleLoans.Server.Api.Cosmos;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

public class Program
{
    public static void Main( string[] args )
    {
        var builder = WebApplication.CreateBuilder( args );

        // Add services to the container.

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        //builder.Services.AddSingleton( x => new CosmosClient( builder.Configuration["CosmosDb:Account"], builder.Configuration["CosmosDb:Key"] ) );

        // Bind MongoDB settings from configuration
        builder.Services.Configure<MongoDbSettings>( builder.Configuration.GetSection( "MongoDbSettings" ) );

        // Register MongoDbService as a singleton
        builder.Services.AddSingleton<MongoDbService>();



        builder.Services.Configure<JwtSettings>( builder.Configuration.GetSection( "JwtSettings" ) );
        builder.Services.AddSingleton<IJwtService, JwtService>();

        builder.Services.AddAuthentication( options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        } )
        .AddJwtBearer( options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                ValidAudience = builder.Configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey( Encoding.UTF8.GetBytes( builder.Configuration["JwtSettings:SecretKey"] ) ),
                ClockSkew = TimeSpan.Zero
            };
        } );

        builder.Services.AddCors( options => options.AddPolicy( "AllowAll", p => p.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader() ) );

        builder.Services.AddDbContext<ApplicationDbContext>( options =>
          options.UseSqlServer(
          builder.Configuration.GetConnectionString( "Default" ) ?? throw new InvalidOperationException(),
          b => b.MigrationsAssembly( typeof( Program ).Assembly.FullName ) ) );

        builder.Services.AddIdentityCore<ApplicationUser>()
          .AddRoles<ApplicationRole>()
          .AddEntityFrameworkStores<ApplicationDbContext>()
          .AddDefaultTokenProviders();

        builder.Services.AddAuthorization( options => {
            options.AddPolicy( "RequireUserRole", policy => policy.RequireRole( "User" ) );

            //TODO can require Role directly, don't need to use claims to handle rolls
            //Need to test this out
            //Can have separate policies for claims, like if people had separate data in their claims
            //Like employee ID, or TITLE, or something else that we save
            //Also can have just a claim or role, not necessarily a specific claim or role
            options.AddPolicy( AuthorizationConstants.ClaimPolicyIsAdmin, policy =>
            policy.RequireClaim( AuthorizationConstants.ClaimAccessLevelType, AuthorizationConstants.ClaimAccessLevelAdmin ) );
        } );


        var app = builder.Build();

        app.UseHttpsRedirection();


        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseSwagger();
        app.UseSwaggerUI( options =>
        {
            options.SwaggerEndpoint( "/swagger/v1/swagger.json", "My API v1" );
        } );


        app.UseCors( builder =>
          builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader() );

        app.MapControllers();
        app.MapFallbackToFile( "index.html" );

        app.MapEndpoints();

        UserSeeding.SeedApplication( app );

        using( var scope = app.Services.CreateScope() )
        {
            var mongoDbService = scope.ServiceProvider.GetRequiredService<MongoDbService>();
            //mongoDbService.DeleteAllAsync().Wait();
            DataSeeding.SeedMongoDb( mongoDbService ).Wait();
        }


        app.Run();
    }
}