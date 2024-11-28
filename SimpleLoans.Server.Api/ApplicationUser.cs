using Microsoft.AspNetCore.Identity;

namespace SimpleLoans.Server.Api;

public class ApplicationUser : IdentityUser<Guid>
{
    public int SuperPrivateField { get; set; }
}
//TODO remove ApplicationRole
public class ApplicationRole : IdentityRole<Guid>
{
}
