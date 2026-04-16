using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WeddingPlannerApi.Models;

namespace WeddingPlannerApi.Security;

public class JwtTokenService
{
    private readonly string _issuer;
    private readonly string _audience;
    private readonly string _signingKey;

    public JwtTokenService(IConfiguration configuration)
    {
        _issuer = configuration["Jwt:Issuer"] ?? "WeddingPlannerApi";
        _audience = configuration["Jwt:Audience"] ?? "WeddingPlannerFrontend";
        _signingKey = configuration["Jwt:SigningKey"] ?? "development-signing-key-change-me-1234567890";
    }

    public string SigningKey => _signingKey;
    public string Issuer => _issuer;
    public string Audience => _audience;

    public string CreateToken(AppUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.DisplayName),
            new(ClaimTypes.Role, user.Role.ToString()),
        };

        if (user.EmployeeId.HasValue)
        {
            claims.Add(new Claim("employeeId", user.EmployeeId.Value.ToString()));
        }

        if (user.CoupleId.HasValue)
        {
            claims.Add(new Claim("coupleId", user.CoupleId.Value.ToString()));
        }

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_signingKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
