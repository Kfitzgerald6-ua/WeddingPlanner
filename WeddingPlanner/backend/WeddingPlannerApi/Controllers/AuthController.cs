using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Data;
using WeddingPlannerApi.DTOs;
using WeddingPlannerApi.Security;

namespace WeddingPlannerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(AppDbContext db, JwtTokenService jwtTokenService)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Email.ToLower() == email);
        if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _jwtTokenService.CreateToken(user);
        return Ok(new LoginResponse(token, MapUser(user)));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthenticatedUserDto>> Me()
    {
        var userId = User.GetUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var user = await _db.Users.FindAsync(userId.Value);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(MapUser(user));
    }

    private static AuthenticatedUserDto MapUser(Models.AppUser user) => new(
        user.Id,
        user.Email,
        user.DisplayName,
        user.Role.ToString().ToLowerInvariant(),
        user.EmployeeId,
        user.CoupleId
    );
}
