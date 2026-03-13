namespace WeddingPlannerApi.Models;

public class Couple
{
    public int Id { get; set; }
    public string Partner1Name { get; set; } = string.Empty;
    public string Partner2Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime WeddingDate { get; set; }
    public string WeddingLocation { get; set; } = string.Empty;
    public int GuestCount { get; set; }
    public decimal Budget { get; set; }
    public WorkflowStage CurrentStage { get; set; } = WorkflowStage.InitialConsultation;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    // Navigation
    public ICollection<EventVendor> EventVendors { get; set; } = new List<EventVendor>();
    public ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}

public enum WorkflowStage
{
    InitialConsultation = 0,
    VenueBooked = 1,
    VendorsSelected = 2,
    ContractsSigned = 3,
    PlanningInProgress = 4,
    FinalDetails = 5,
    WeddingDay = 6,
    PostWedding = 7,
    Completed = 8
}

public class Vendor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public VendorCategory Category { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal TypicalPriceMin { get; set; }
    public decimal TypicalPriceMax { get; set; }
    public int TimesUsed { get; set; }
    public double InternalRating { get; set; }
    public string? Notes { get; set; }
    public bool IsPreferred { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<EventVendor> EventVendors { get; set; } = new List<EventVendor>();
}

public enum VendorCategory
{
    Venue,
    Catering,
    Photography,
    Videography,
    Florist,
    Music,
    Cake,
    HairAndMakeup,
    Officiant,
    Transportation,
    Lighting,
    Decor,
    Invitations,
    Jewelry,
    Other
}

public class EventVendor
{
    public int Id { get; set; }
    public int CoupleId { get; set; }
    public int VendorId { get; set; }
    public decimal ContractedPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Inquiry;
    public DateTime? ContractSignedDate { get; set; }
    public decimal DepositAmount { get; set; }
    public bool DepositPaid { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Couple Couple { get; set; } = null!;
    public Vendor Vendor { get; set; } = null!;
}

public enum BookingStatus
{
    Inquiry,
    Quoted,
    Negotiating,
    Confirmed,
    ContractSigned,
    DepositPaid,
    Cancelled
}

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime HiredDate { get; set; }

    // Navigation
    public ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
}

public class TimeEntry
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int CoupleId { get; set; }
    public DateTime ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public string? Description { get; set; }
    public TimeEntryType EntryType { get; set; } = TimeEntryType.Planning;
    public bool IsBillable { get; set; } = true;

    // Computed
    public double? HoursWorked => ClockOut.HasValue
        ? (ClockOut.Value - ClockIn).TotalHours
        : null;

    // Navigation
    public Employee Employee { get; set; } = null!;
    public Couple Couple { get; set; } = null!;
}

public enum TimeEntryType
{
    Planning,
    VendorMeeting,
    ClientMeeting,
    WeddingDay,
    Travel,
    Administrative
}

public class Document
{
    public int Id { get; set; }
    public int CoupleId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public DocumentType Type { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    // Navigation
    public Couple Couple { get; set; } = null!;
}

public enum DocumentType
{
    Contract,
    Invoice,
    InspirationImage,
    VenueLayout,
    Timeline,
    GuestList,
    Other
}
