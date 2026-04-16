using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Data;
using WeddingPlannerApi.DTOs;
using WeddingPlannerApi.Models;
using WeddingPlannerApi.Security;

namespace WeddingPlannerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Planner")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmployeesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll()
    {
        var employees = await _db.Employees.Where(e => e.IsActive).ToListAsync();
        return Ok(employees.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetById(int id)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return NotFound();
        return Ok(MapToDto(e));
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create(CreateEmployeeRequest req)
    {
        var employee = new Employee
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            Role = req.Role,
            HourlyRate = req.HourlyRate,
            HiredDate = req.HiredDate
        };
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, MapToDto(employee));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var employee = await _db.Employees.FindAsync(id);
        if (employee is null) return NotFound();
        employee.IsActive = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static EmployeeDto MapToDto(Employee e) => new(
        e.Id, e.FirstName, e.LastName,
        $"{e.FirstName} {e.LastName}",
        e.Email, e.Role, e.HourlyRate, e.IsActive, e.HiredDate
    );
}

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Planner")]
public class TimeEntriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public TimeEntriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimeEntryDto>>> GetAll(
        [FromQuery] int? employeeId,
        [FromQuery] int? coupleId)
    {
        var currentEmployeeId = User.GetEmployeeId();
        var query = _db.TimeEntries
            .Include(t => t.Employee)
            .Include(t => t.Couple)
            .AsQueryable();

        if (User.IsInRole(nameof(AppRole.Planner)))
        {
            if (!currentEmployeeId.HasValue)
            {
                return Forbid();
            }

            query = query.Where(t => t.EmployeeId == currentEmployeeId.Value);
        }
        else if (employeeId.HasValue)
        {
            query = query.Where(t => t.EmployeeId == employeeId);
        }

        if (coupleId.HasValue) query = query.Where(t => t.CoupleId == coupleId);

        var entries = await query.OrderByDescending(t => t.ClockIn).ToListAsync();
        return Ok(entries.Select(MapToDto));
    }

    [HttpPost("clock-in")]
    public async Task<ActionResult<TimeEntryDto>> ClockIn(ClockInRequest req)
    {
        var currentEmployeeId = User.GetEmployeeId();
        if (User.IsInRole(nameof(AppRole.Planner)) && currentEmployeeId != req.EmployeeId)
        {
            return Forbid();
        }

        var employee = await _db.Employees.FindAsync(req.EmployeeId);
        if (employee is null) return BadRequest("Employee not found.");

        var couple = await _db.Couples.FindAsync(req.CoupleId);
        if (couple is null) return BadRequest("Couple not found.");

        // Check for open entry
        var openEntry = await _db.TimeEntries
            .FirstOrDefaultAsync(t => t.EmployeeId == req.EmployeeId && t.ClockOut == null);
        if (openEntry is not null)
            return Conflict("Employee already has an open time entry. Clock out first.");

        var entry = new TimeEntry
        {
            EmployeeId = req.EmployeeId,
            CoupleId = req.CoupleId,
            ClockIn = DateTime.UtcNow,
            EntryType = req.EntryType,
            Description = req.Description
        };
        _db.TimeEntries.Add(entry);
        await _db.SaveChangesAsync();

        // Reload with navigation
        entry.Employee = employee;
        entry.Couple = couple;
        return Ok(MapToDto(entry));
    }

    [HttpPatch("clock-out")]
    public async Task<ActionResult<TimeEntryDto>> ClockOut(ClockOutRequest req)
    {
        var currentEmployeeId = User.GetEmployeeId();
        var entry = await _db.TimeEntries
            .Include(t => t.Employee)
            .Include(t => t.Couple)
            .FirstOrDefaultAsync(t => t.Id == req.TimeEntryId);

        if (entry is null) return NotFound();
        if (User.IsInRole(nameof(AppRole.Planner)) && currentEmployeeId != entry.EmployeeId)
        {
            return Forbid();
        }

        if (entry.ClockOut.HasValue) return Conflict("Entry is already clocked out.");

        entry.ClockOut = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(MapToDto(entry));
    }

    private static TimeEntryDto MapToDto(TimeEntry t) => new(
        t.Id, t.EmployeeId,
        $"{t.Employee.FirstName} {t.Employee.LastName}",
        t.CoupleId,
        $"{t.Couple.Partner1Name} & {t.Couple.Partner2Name}",
        t.ClockIn, t.ClockOut, t.HoursWorked,
        t.Description, t.EntryType, t.EntryType.ToString(), t.IsBillable
    );
}
