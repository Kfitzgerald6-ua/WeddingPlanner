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
public class VendorsController : ControllerBase
{
    private readonly AppDbContext _db;
    public VendorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VendorDto>>> GetAll(
        [FromQuery] VendorCategory? category,
        [FromQuery] string? city,
        [FromQuery] bool? preferredOnly)
    {
        var query = _db.Vendors.AsQueryable();

        if (category.HasValue) query = query.Where(v => v.Category == category);
        if (!string.IsNullOrEmpty(city)) query = query.Where(v => v.City.ToLower().Contains(city.ToLower()));
        if (preferredOnly == true) query = query.Where(v => v.IsPreferred);

        var vendors = await query.OrderByDescending(v => v.InternalRating).ToListAsync();
        return Ok(vendors.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VendorDto>> GetById(int id)
    {
        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor is null) return NotFound();
        return Ok(MapToDto(vendor));
    }

    [HttpPost]
    public async Task<ActionResult<VendorDto>> Create(CreateVendorRequest req)
    {
        var vendor = new Vendor
        {
            Name = req.Name,
            Category = req.Category,
            ContactName = req.ContactName,
            Email = req.Email,
            Phone = req.Phone,
            Website = req.Website,
            Address = req.Address,
            City = req.City,
            State = req.State,
            TypicalPriceMin = req.TypicalPriceMin,
            TypicalPriceMax = req.TypicalPriceMax,
            IsPreferred = req.IsPreferred,
            Notes = req.Notes
        };
        _db.Vendors.Add(vendor);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = vendor.Id }, MapToDto(vendor));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VendorDto>> Update(int id, CreateVendorRequest req)
    {
        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor is null) return NotFound();

        vendor.Name = req.Name;
        vendor.Category = req.Category;
        vendor.ContactName = req.ContactName;
        vendor.Email = req.Email;
        vendor.Phone = req.Phone;
        vendor.Website = req.Website;
        vendor.Address = req.Address;
        vendor.City = req.City;
        vendor.State = req.State;
        vendor.TypicalPriceMin = req.TypicalPriceMin;
        vendor.TypicalPriceMax = req.TypicalPriceMax;
        vendor.IsPreferred = req.IsPreferred;
        vendor.Notes = req.Notes;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(vendor));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor is null) return NotFound();
        _db.Vendors.Remove(vendor);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// AI-powered vendor recommendation endpoint.
    /// Scores vendors by budget fit, rating, usage history, and location match.
    /// In production, this would integrate with an AI/ML service for richer recommendations.
    /// </summary>
    [HttpPost("recommend")]
    public async Task<ActionResult<IEnumerable<VendorDto>>> Recommend(VendorRecommendationRequest req)
    {
        var vendors = await _db.Vendors
            .Where(v => v.Category == req.Category)
            .ToListAsync();

        // Scoring algorithm — each factor contributes to a 0–100 score
        var scored = vendors.Select(v =>
        {
            double score = 0;

            // Budget fit (40 points)
            bool withinBudget = v.TypicalPriceMin <= req.BudgetMax && v.TypicalPriceMax >= req.BudgetMin;
            if (withinBudget) score += 40;
            else if (v.TypicalPriceMin <= req.BudgetMax * 1.1m) score += 20; // Within 10% over

            // Internal rating (30 points — normalized from 0–5)
            score += (v.InternalRating / 5.0) * 30;

            // Usage history (15 points — capped at 20 uses)
            score += Math.Min(v.TimesUsed / 20.0, 1.0) * 15;

            // Location match (10 points)
            bool cityMatch = v.City.Equals(req.City, StringComparison.OrdinalIgnoreCase);
            bool stateMatch = v.State.Equals(req.State, StringComparison.OrdinalIgnoreCase);
            if (cityMatch) score += 10;
            else if (stateMatch) score += 5;

            // Preferred boost (5 points)
            if (v.IsPreferred) score += 5;

            return new { Vendor = v, Score = score };
        })
        .OrderByDescending(x => x.Score)
        .Take(5)
        .Select(x => x.Vendor)
        .ToList();

        return Ok(scored.Select(MapToDto));
    }

    [HttpPost("assign")]
    public async Task<ActionResult<EventVendorDto>> AssignToCouple(AssignVendorRequest req)
    {
        var couple = await _db.Couples.FindAsync(req.CoupleId);
        if (couple is null) return BadRequest("Couple not found.");

        var vendor = await _db.Vendors.FindAsync(req.VendorId);
        if (vendor is null) return BadRequest("Vendor not found.");

        var existing = await _db.EventVendors
            .FirstOrDefaultAsync(ev => ev.CoupleId == req.CoupleId && ev.VendorId == req.VendorId);
        if (existing is not null) return Conflict("Vendor already assigned to this couple.");

        var eventVendor = new EventVendor
        {
            CoupleId = req.CoupleId,
            VendorId = req.VendorId,
            ContractedPrice = req.ContractedPrice,
            DepositAmount = req.DepositAmount,
            Notes = req.Notes
        };
        _db.EventVendors.Add(eventVendor);

        // Increment usage count
        vendor.TimesUsed++;
        await _db.SaveChangesAsync();

        return Ok(new EventVendorDto(
            eventVendor.Id, eventVendor.CoupleId,
            $"{couple.Partner1Name} & {couple.Partner2Name}",
            eventVendor.VendorId, vendor.Name, vendor.Category,
            eventVendor.ContractedPrice, eventVendor.Status, eventVendor.Status.ToString(),
            eventVendor.ContractSignedDate, eventVendor.DepositAmount, eventVendor.DepositPaid, eventVendor.Notes
        ));
    }

    [HttpPatch("bookings/{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(int id, UpdateBookingStatusRequest req)
    {
        var ev = await _db.EventVendors.FindAsync(id);
        if (ev is null) return NotFound();
        ev.Status = req.NewStatus;
        if (req.NewStatus == BookingStatus.ContractSigned)
            ev.ContractSignedDate = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static VendorDto MapToDto(Vendor v) => new(
        v.Id, v.Name, v.Category, v.Category.ToString(),
        v.ContactName, v.Email, v.Phone, v.Website,
        v.City, v.State, v.TypicalPriceMin, v.TypicalPriceMax,
        v.TimesUsed, v.InternalRating, v.IsPreferred, v.Notes
    );
}
