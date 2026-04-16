using WeddingPlannerApi.Models;

namespace WeddingPlannerApi.DTOs;

// ── Couple DTOs ──────────────────────────────────────────────────────────────

public record CoupleDto(
    int Id,
    string Partner1Name,
    string Partner2Name,
    string Email,
    string Phone,
    DateTime WeddingDate,
    string WeddingLocation,
    int GuestCount,
    decimal Budget,
    WorkflowStage CurrentStage,
    string CurrentStageLabel,
    DateTime CreatedAt,
    string? Notes
);

public record CreateCoupleRequest(
    string Partner1Name,
    string Partner2Name,
    string Email,
    string Phone,
    DateTime WeddingDate,
    string WeddingLocation,
    int GuestCount,
    decimal Budget,
    string? Notes
);

public record UpdateStageRequest(WorkflowStage NewStage);

// ── Auth DTOs ─────────────────────────────────────────────────────────────────

public record LoginRequest(
    string Email,
    string Password
);

public record AuthenticatedUserDto(
    int Id,
    string Email,
    string DisplayName,
    string Role,
    int? EmployeeId,
    int? CoupleId
);

public record LoginResponse(
    string Token,
    AuthenticatedUserDto User
);

// ── Vendor DTOs ───────────────────────────────────────────────────────────────

public record VendorDto(
    int Id,
    string Name,
    VendorCategory Category,
    string CategoryLabel,
    string ContactName,
    string Email,
    string Phone,
    string? Website,
    string City,
    string State,
    decimal TypicalPriceMin,
    decimal TypicalPriceMax,
    int TimesUsed,
    double InternalRating,
    bool IsPreferred,
    string? Notes
);

public record CreateVendorRequest(
    string Name,
    VendorCategory Category,
    string ContactName,
    string Email,
    string Phone,
    string? Website,
    string Address,
    string City,
    string State,
    decimal TypicalPriceMin,
    decimal TypicalPriceMax,
    bool IsPreferred,
    string? Notes
);

public record VendorRecommendationRequest(
    string City,
    string State,
    VendorCategory Category,
    decimal BudgetMin,
    decimal BudgetMax,
    int GuestCount
);

// ── EventVendor DTOs ──────────────────────────────────────────────────────────

public record EventVendorDto(
    int Id,
    int CoupleId,
    string CoupleName,
    int VendorId,
    string VendorName,
    VendorCategory Category,
    decimal ContractedPrice,
    BookingStatus Status,
    string StatusLabel,
    DateTime? ContractSignedDate,
    decimal DepositAmount,
    bool DepositPaid,
    string? Notes
);

public record AssignVendorRequest(
    int CoupleId,
    int VendorId,
    decimal ContractedPrice,
    decimal DepositAmount,
    string? Notes
);

public record UpdateBookingStatusRequest(BookingStatus NewStatus);

// ── Employee DTOs ─────────────────────────────────────────────────────────────

public record EmployeeDto(
    int Id,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string Role,
    decimal HourlyRate,
    bool IsActive,
    DateTime HiredDate
);

public record CreateEmployeeRequest(
    string FirstName,
    string LastName,
    string Email,
    string Role,
    decimal HourlyRate,
    DateTime HiredDate
);

// ── TimeEntry DTOs ─────────────────────────────────────────────────────────────

public record TimeEntryDto(
    int Id,
    int EmployeeId,
    string EmployeeName,
    int CoupleId,
    string CoupleName,
    DateTime ClockIn,
    DateTime? ClockOut,
    double? HoursWorked,
    string? Description,
    TimeEntryType EntryType,
    string EntryTypeLabel,
    bool IsBillable
);

public record ClockInRequest(
    int EmployeeId,
    int CoupleId,
    TimeEntryType EntryType,
    string? Description
);

public record ClockOutRequest(int TimeEntryId);

public record TimeEntrySummaryDto(
    int CoupleId,
    string CoupleName,
    double TotalHours,
    double BillableHours,
    decimal TotalCost,
    List<TimeEntryDto> Entries
);

public record CouplePortalOverviewDto(
    CoupleDto Couple,
    List<EventVendorDto> Vendors
);

// ── Dashboard DTOs ────────────────────────────────────────────────────────────

public record DashboardDto(
    int TotalCouples,
    int UpcomingWeddings30Days,
    int TotalVendors,
    int ActiveEmployees,
    List<CoupleDto> RecentCouples,
    List<VendorDto> PreferredVendors
);
