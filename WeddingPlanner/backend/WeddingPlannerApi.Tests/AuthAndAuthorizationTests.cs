using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace WeddingPlannerApi.Tests;

public class AuthAndAuthorizationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthAndAuthorizationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_Returns_Jwt_And_User_Profile()
    {
        using var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "manager@bloomco.com",
            password = "Password123!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(payload);
        Assert.False(string.IsNullOrWhiteSpace(payload!.Token));
        Assert.Equal("manager", payload.User.Role);
        Assert.Equal("manager@bloomco.com", payload.User.Email);
    }

    [Fact]
    public async Task Couples_List_Requires_Authenticated_Staff_User()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/couples");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Couple_Portal_Returns_Only_Authenticated_Couple_Data()
    {
        using var client = _factory.CreateClient();
        var login = await LoginAsync(client, "emma.liam@email.com", "Password123!");

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.Token);

        var response = await client.GetAsync("/api/couple-portal/overview");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var overview = await response.Content.ReadFromJsonAsync<CouplePortalOverview>();
        Assert.NotNull(overview);
        Assert.Equal(1, overview!.Couple.Id);
        Assert.Equal("Emma Thompson", overview.Couple.Partner1Name);
        Assert.DoesNotContain(overview.Vendors, vendor => vendor.CoupleId != 1);
    }

    [Fact]
    public async Task Couple_User_Cannot_Read_Internal_Time_Entries()
    {
        using var client = _factory.CreateClient();
        var login = await LoginAsync(client, "emma.liam@email.com", "Password123!");

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.Token);

        var response = await client.GetAsync("/api/timeentries");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private static async Task<LoginResponse> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password });
        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>();
        return payload ?? throw new InvalidOperationException("Login payload was null.");
    }

    private sealed record LoginResponse(string Token, AuthenticatedUser User);
    private sealed record AuthenticatedUser(int Id, string Email, string DisplayName, string Role, int? CoupleId);
    private sealed record CouplePortalOverview(CoupleSummary Couple, List<AssignedVendor> Vendors);
    private sealed record CoupleSummary(int Id, string Partner1Name, string Partner2Name);
    private sealed record AssignedVendor(int Id, int CoupleId, string CoupleName, int VendorId, string VendorName);
}
