using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using static SimpleLoans.Server.Api.UserSeeding;

namespace SimpleLoans.Server.Api;

public static class MapEndpointHelper
{
    public static WebApplication MapEndpoints( this WebApplication app )
    {
        app
            //.MapEmailEndpoints()
            //.MapPartsterrEndpoints()
            .MapUserEndpoints();

        return app;
    }

    private static WebApplication MapUserEndpoints( this WebApplication app )
    {
        app.MapPost( "/api/token", [AllowAnonymous] async ( UserManager<ApplicationUser> userManager,
                                                            IJwtService jwtService, HttpContext context
                                                            ,
                                                            [FromBody] UserSeeding.UserCredentials userRecord 
                                                            ) =>
        {
            //var userRecord = await context.Request.ReadFromJsonAsync<UserCredentials>();

            //if( userRecord == null )
            //    return Results.BadRequest( "Invalid request body." );

            var user = await UserSeeding.IsValidLoginInfo( userManager, userRecord );

            //Todo separate code to handle unauthorized and Internal error
            if( user != null )
            {
                var token = await jwtService.GenerateToken( userManager, user );
                //await context.Response.WriteAsJsonAsync(new {token});
                return Results.Json( new { token } );
            }

            //Fix this
            return Results.BadRequest();
        } ).Produces<JwtToken>()
           .Produces( StatusCodes.Status400BadRequest );

        app.MapGet( "/api/users/", async ( UserManager<ApplicationUser> userManager, HttpContext context ) =>
        {
            var user = await GetUserFromClaimsPrincipal( context.User, userManager );
            if( user == null )
            {
                return Results.NotFound();
            }

            var claims = context.User.Claims.Select( c => new ClaimRecord() { Type = c.Type, Value = c.Value } )
                                .ToList();
            var roles = await userManager.GetRolesAsync( user );

            var result = new { user, roles, claims };

            return Results.Json( result );
        } ).RequireAuthorization( AuthorizationConstants.ClaimPolicyIsAdmin );

        return app;
    }

    private static async Task<ApplicationUser?> GetUserFromClaimsPrincipal(
       ClaimsPrincipal claimsPrincipal, UserManager<ApplicationUser> userManager )
    {
        try
        {
            var userId = Guid.Parse( claimsPrincipal
                                     .Claims.First( c =>
                                         c.Type.Equals( Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames
                                                                 .Sub ) )
                                     .Value );
            var user = await userManager.Users.FirstOrDefaultAsync( c => c.Id.Equals( userId ) );
            if( user != null )
                return user;

            var username = claimsPrincipal.Claims.First( c =>
                c.Type.Equals( Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Name ) ).Value;
            user = await userManager.Users.FirstOrDefaultAsync( c => c.Email.Equals( username ) );
            if( user != null )
                return user;

            var userEmail = claimsPrincipal.Claims.First( c =>
                c.Type.Equals( Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Email ) ).Value;
            user = await userManager.Users.FirstOrDefaultAsync( c => c.Email.Equals( userEmail ) );
            if( user != null )
                return user;

            return null;
        }
        catch
        {
            return null;
        }
    }

}

public static class AuthorizationConstants
{
    public const string ClaimPolicyIsAdmin = "IsAdmin";


    public const string ClaimAccessLevelType = "AccessLevel";
    public const string ClaimAccessLevelAdmin = "Admin";
}