using System.Security.Claims;

namespace WeddingPlannerApi.Security;

public static class ClaimsPrincipalExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub");
        return int.TryParse(raw, out var id) ? id : null;
    }

    public static int? GetEmployeeId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue("employeeId");
        return int.TryParse(raw, out var id) ? id : null;
    }

    public static int? GetCoupleId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue("coupleId");
        return int.TryParse(raw, out var id) ? id : null;
    }
}
