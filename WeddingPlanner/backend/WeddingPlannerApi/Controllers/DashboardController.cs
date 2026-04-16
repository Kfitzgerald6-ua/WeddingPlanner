using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Data;
using WeddingPlannerApi.DTOs;
using WeddingPlannerApi.Models;

namespace WeddingPlannerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Planner")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> Get()
    {
        var now = DateTime.UtcNow;
        var in30Days = now.AddDays(30);

        var totalCouples = await _db.Couples.CountAsync();
        var upcomingWeddings = await _db.Couples
            .CountAsync(c => c.WeddingDate >= now && c.WeddingDate <= in30Days);
        var totalVendors = await _db.Vendors.CountAsync();
        var activeEmployees = await _db.Employees.CountAsync(e => e.IsActive);

        var recentCouples = await _db.Couples
            .OrderBy(c => c.WeddingDate)
            .Take(5)
            .ToListAsync();

        var preferredVendors = await _db.Vendors
            .Where(v => v.IsPreferred)
            .OrderByDescending(v => v.InternalRating)
            .Take(6)
            .ToListAsync();

        return Ok(new DashboardDto(
            totalCouples,
            upcomingWeddings,
            totalVendors,
            activeEmployees,
            recentCouples.Select(c => new CoupleDto(
                c.Id, c.Partner1Name, c.Partner2Name, c.Email, c.Phone,
                c.WeddingDate, c.WeddingLocation, c.GuestCount, c.Budget,
                c.CurrentStage, c.CurrentStage.ToString(), c.CreatedAt, c.Notes
            )).ToList(),
            preferredVendors.Select(v => new VendorDto(
                v.Id, v.Name, v.Category, v.Category.ToString(),
                v.ContactName, v.Email, v.Phone, v.Website,
                v.City, v.State, v.TypicalPriceMin, v.TypicalPriceMax,
                v.TimesUsed, v.InternalRating, v.IsPreferred, v.Notes
            )).ToList()
        ));
    }
}
