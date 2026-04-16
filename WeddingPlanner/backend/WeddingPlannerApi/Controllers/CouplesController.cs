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
public class CouplesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CouplesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoupleDto>>> GetAll()
    {
        var couples = await _db.Couples.OrderBy(c => c.WeddingDate).ToListAsync();
        return Ok(couples.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CoupleDto>> GetById(int id)
    {
        var couple = await _db.Couples.FindAsync(id);
        if (couple is null) return NotFound();
        return Ok(MapToDto(couple));
    }

    [HttpPost]
    public async Task<ActionResult<CoupleDto>> Create(CreateCoupleRequest req)
    {
        var couple = new Couple
        {
            Partner1Name = req.Partner1Name,
            Partner2Name = req.Partner2Name,
            Email = req.Email,
            Phone = req.Phone,
            WeddingDate = req.WeddingDate,
            WeddingLocation = req.WeddingLocation,
            GuestCount = req.GuestCount,
            Budget = req.Budget,
            Notes = req.Notes
        };
        _db.Couples.Add(couple);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = couple.Id }, MapToDto(couple));
    }

    [HttpPatch("{id}/stage")]
    public async Task<ActionResult<CoupleDto>> UpdateStage(int id, UpdateStageRequest req)
    {
        var couple = await _db.Couples.FindAsync(id);
        if (couple is null) return NotFound();
        couple.CurrentStage = req.NewStage;
        await _db.SaveChangesAsync();
        return Ok(MapToDto(couple));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var couple = await _db.Couples.FindAsync(id);
        if (couple is null) return NotFound();
        _db.Couples.Remove(couple);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/vendors")]
    public async Task<ActionResult<IEnumerable<EventVendorDto>>> GetVendors(int id)
    {
        var eventVendors = await _db.EventVendors
            .Include(ev => ev.Vendor)
            .Include(ev => ev.Couple)
            .Where(ev => ev.CoupleId == id)
            .ToListAsync();

        return Ok(eventVendors.Select(ev => new EventVendorDto(
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
        )));
    }

    [HttpGet("{id}/time-summary")]
    public async Task<ActionResult<TimeEntrySummaryDto>> GetTimeSummary(int id)
    {
        var couple = await _db.Couples.FindAsync(id);
        if (couple is null) return NotFound();

        var entries = await _db.TimeEntries
            .Include(t => t.Employee)
            .Where(t => t.CoupleId == id && t.ClockOut.HasValue)
            .ToListAsync();

        var totalHours = entries.Sum(e => e.HoursWorked ?? 0);
        var billableHours = entries.Where(e => e.IsBillable).Sum(e => e.HoursWorked ?? 0);
        var totalCost = entries
            .Where(e => e.IsBillable)
            .Sum(e => (decimal)(e.HoursWorked ?? 0) * e.Employee.HourlyRate);

        var entryDtos = entries.Select(e => new TimeEntryDto(
            e.Id, e.EmployeeId,
            $"{e.Employee.FirstName} {e.Employee.LastName}",
            e.CoupleId,
            $"{couple.Partner1Name} & {couple.Partner2Name}",
            e.ClockIn, e.ClockOut, e.HoursWorked,
            e.Description, e.EntryType, e.EntryType.ToString(), e.IsBillable
        )).ToList();

        return Ok(new TimeEntrySummaryDto(
            id,
            $"{couple.Partner1Name} & {couple.Partner2Name}",
            totalHours, billableHours, totalCost, entryDtos
        ));
    }

    private static CoupleDto MapToDto(Couple c) => new(
        c.Id, c.Partner1Name, c.Partner2Name, c.Email, c.Phone,
        c.WeddingDate, c.WeddingLocation, c.GuestCount, c.Budget,
        c.CurrentStage, c.CurrentStage.ToString(), c.CreatedAt, c.Notes
    );
}
