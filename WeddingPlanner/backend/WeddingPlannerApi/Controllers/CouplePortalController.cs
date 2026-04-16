using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Data;
using WeddingPlannerApi.DTOs;
using WeddingPlannerApi.Security;

namespace WeddingPlannerApi.Controllers;

[ApiController]
[Route("api/couple-portal")]
[Authorize(Roles = "Couple")]
public class CouplePortalController : ControllerBase
{
    private readonly AppDbContext _db;

    public CouplePortalController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<CouplePortalOverviewDto>> GetOverview()
    {
        var coupleId = User.GetCoupleId();
        if (!coupleId.HasValue)
        {
            return Forbid();
        }

        var couple = await _db.Couples.FindAsync(coupleId.Value);
        if (couple is null)
        {
            return NotFound();
        }

        var vendors = await _db.EventVendors
            .Include(ev => ev.Couple)
            .Include(ev => ev.Vendor)
            .Where(ev => ev.CoupleId == couple.Id)
            .OrderBy(ev => ev.Vendor.Name)
            .ToListAsync();

        return Ok(new CouplePortalOverviewDto(
            new CoupleDto(
                couple.Id,
                couple.Partner1Name,
                couple.Partner2Name,
                couple.Email,
                couple.Phone,
                couple.WeddingDate,
                couple.WeddingLocation,
                couple.GuestCount,
                couple.Budget,
                couple.CurrentStage,
                couple.CurrentStage.ToString(),
                couple.CreatedAt,
                couple.Notes
            ),
            vendors.Select(ev => new EventVendorDto(
                ev.Id,
                ev.CoupleId,
                $"{ev.Couple.Partner1Name} & {ev.Couple.Partner2Name}",
                ev.VendorId,
                ev.Vendor.Name,
                ev.Vendor.Category,
                ev.ContractedPrice,
                ev.Status,
                ev.Status.ToString(),
                ev.ContractSignedDate,
                ev.DepositAmount,
                ev.DepositPaid,
                ev.Notes
            )).ToList()
        ));
    }
}
