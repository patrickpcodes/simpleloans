using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using static Azure.Core.HttpHeader;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SimpleLoans.Server.Api;


public class JwtToken
{
    public string AccessToken { get; set; }
    public int ExpiryInMinutes { get; set; }
}

public interface IJwtService
{
    Task<JwtToken> GenerateToken( UserManager<ApplicationUser> userManager, ApplicationUser user );
}

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;

    public JwtService( IOptions<JwtSettings> jwtSettings )
    {
        _jwtSettings = jwtSettings.Value;
    }
    public async Task<JwtToken> GenerateToken( UserManager<ApplicationUser> userManager, ApplicationUser user )
    {
        var claimList = await userManager.GetClaimsAsync( user );

        var expirationDate = new DateTimeOffset( DateTime.Now.AddMinutes( _jwtSettings.ExpiryInMinutes ) );

        var claims = new List<Claim>
     {
          new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
          new (JwtRegisteredClaimNames.UniqueName, user.UserName),
          new (JwtRegisteredClaimNames.Email, user.Email),
          new (JwtRegisteredClaimNames.Nbf, new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds().ToString()),
          new (JwtRegisteredClaimNames.Exp, expirationDate.ToUnixTimeSeconds().ToString()),
          new ("username", user.UserName),
     };


        claims.AddRange( claimList );

        var key = new SymmetricSecurityKey( Encoding.UTF8.GetBytes( _jwtSettings.SecretKey ) );
        var credentials = new SigningCredentials( key, SecurityAlgorithms.HmacSha256 );

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes( _jwtSettings.ExpiryInMinutes ),
            signingCredentials: credentials );

        var jwtToken = new JwtToken();
        jwtToken.AccessToken = new JwtSecurityTokenHandler().WriteToken( token );
        jwtToken.ExpiryInMinutes = _jwtSettings.ExpiryInMinutes;

        return jwtToken;
    }
}

