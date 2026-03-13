using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Models;

namespace WeddingPlannerApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Couple> Couples => Set<Couple>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<EventVendor> EventVendors => Set<EventVendor>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<TimeEntry> TimeEntries => Set<TimeEntry>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Couple
        modelBuilder.Entity<Couple>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Budget).HasPrecision(18, 2);
        });

        // Vendor
        modelBuilder.Entity<Vendor>(e =>
        {
            e.HasKey(v => v.Id);
            e.Property(v => v.TypicalPriceMin).HasPrecision(18, 2);
            e.Property(v => v.TypicalPriceMax).HasPrecision(18, 2);
        });

        // EventVendor (join table)
        modelBuilder.Entity<EventVendor>(e =>
        {
            e.HasKey(ev => ev.Id);
            e.Property(ev => ev.ContractedPrice).HasPrecision(18, 2);
            e.Property(ev => ev.DepositAmount).HasPrecision(18, 2);
            e.HasOne(ev => ev.Couple)
                .WithMany(c => c.EventVendors)
                .HasForeignKey(ev => ev.CoupleId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ev => ev.Vendor)
                .WithMany(v => v.EventVendors)
                .HasForeignKey(ev => ev.VendorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Employee
        modelBuilder.Entity<Employee>(e =>
        {
            e.HasKey(em => em.Id);
            e.Property(em => em.HourlyRate).HasPrecision(18, 2);
        });

        // TimeEntry
        modelBuilder.Entity<TimeEntry>(e =>
        {
            e.HasKey(t => t.Id);
            e.Ignore(t => t.HoursWorked);
            e.HasOne(t => t.Employee)
                .WithMany(em => em.TimeEntries)
                .HasForeignKey(t => t.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.Couple)
                .WithMany(c => c.TimeEntries)
                .HasForeignKey(t => t.CoupleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Document
        modelBuilder.Entity<Document>(e =>
        {
            e.HasKey(d => d.Id);
            e.HasOne(d => d.Couple)
                .WithMany(c => c.Documents)
                .HasForeignKey(d => d.CoupleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Vendors
        modelBuilder.Entity<Vendor>().HasData(
            new Vendor { Id = 1, Name = "Magnolia Blooms", Category = VendorCategory.Florist, ContactName = "Sarah Mitchell", Email = "sarah@magnoliablooms.com", Phone = "205-555-0101", City = "Tuscaloosa", State = "AL", TypicalPriceMin = 2500, TypicalPriceMax = 8000, TimesUsed = 12, InternalRating = 4.8, IsPreferred = true, Notes = "Excellent with organic arrangements. Always on time." },
            new Vendor { Id = 2, Name = "Tuscaloosa Grand Ballroom", Category = VendorCategory.Venue, ContactName = "James Porter", Email = "events@tgb.com", Phone = "205-555-0202", City = "Tuscaloosa", State = "AL", TypicalPriceMin = 5000, TypicalPriceMax = 15000, TimesUsed = 8, InternalRating = 4.6, IsPreferred = true, Notes = "Capacity 300. Full kitchen. Excellent staff." },
            new Vendor { Id = 3, Name = "Golden Hour Photography", Category = VendorCategory.Photography, ContactName = "Lena Cruz", Email = "lena@goldenhour.photo", Phone = "205-555-0303", City = "Birmingham", State = "AL", TypicalPriceMin = 3500, TypicalPriceMax = 7000, TimesUsed = 20, InternalRating = 4.9, IsPreferred = true, Notes = "Our go-to photographer. Exceptional editorial style." },
            new Vendor { Id = 4, Name = "Sweet Layers Bakery", Category = VendorCategory.Cake, ContactName = "Devon Hughes", Email = "devon@sweetlayers.com", Phone = "205-555-0404", City = "Tuscaloosa", State = "AL", TypicalPriceMin = 800, TypicalPriceMax = 3000, TimesUsed = 15, InternalRating = 4.7, IsPreferred = false, Notes = "Custom cakes, dietary accommodations available." },
            new Vendor { Id = 5, Name = "Harmony Strings Quartet", Category = VendorCategory.Music, ContactName = "Rachel Kim", Email = "rachel@harmonystrings.com", Phone = "205-555-0505", City = "Tuscaloosa", State = "AL", TypicalPriceMin = 1200, TypicalPriceMax = 3500, TimesUsed = 6, InternalRating = 4.5, IsPreferred = false, Notes = "Classical and contemporary. Also offers DJ services." },
            new Vendor { Id = 6, Name = "Elegance Catering Co.", Category = VendorCategory.Catering, ContactName = "Marcus Bell", Email = "marcus@elegancecatering.com", Phone = "205-555-0606", City = "Tuscaloosa", State = "AL", TypicalPriceMin = 8000, TypicalPriceMax = 25000, TimesUsed = 10, InternalRating = 4.6, IsPreferred = true, Notes = "Farm-to-table specialists. Can handle up to 400 guests." }
        );

        // Couples
        modelBuilder.Entity<Couple>().HasData(
            new Couple { Id = 1, Partner1Name = "Emma Thompson", Partner2Name = "Liam Nguyen", Email = "emma.liam@email.com", Phone = "205-555-1001", WeddingDate = new DateTime(2025, 6, 14), WeddingLocation = "Tuscaloosa, AL", GuestCount = 150, Budget = 45000, CurrentStage = WorkflowStage.VendorsSelected, Notes = "Outdoor garden ceremony preferred. Allergic to lilies." },
            new Couple { Id = 2, Partner1Name = "Sophia Martinez", Partner2Name = "Alex Johnson", Email = "sophia.alex@email.com", Phone = "205-555-1002", WeddingDate = new DateTime(2025, 9, 20), WeddingLocation = "Birmingham, AL", GuestCount = 200, Budget = 65000, CurrentStage = WorkflowStage.InitialConsultation, Notes = "Luxury aesthetic. Black-tie optional." },
            new Couple { Id = 3, Partner1Name = "Olivia Chen", Partner2Name = "Noah Williams", Email = "olivia.noah@email.com", Phone = "205-555-1003", WeddingDate = new DateTime(2025, 4, 5), WeddingLocation = "Tuscaloosa, AL", GuestCount = 80, Budget = 28000, CurrentStage = WorkflowStage.FinalDetails, Notes = "Intimate ceremony. Bohemian style." }
        );

        // Employees
        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FirstName = "Rachel", LastName = "Torres", Email = "rachel@weddingco.com", Role = "Lead Planner", HourlyRate = 75, IsActive = true, HiredDate = new DateTime(2022, 3, 15) },
            new Employee { Id = 2, FirstName = "Jordan", LastName = "Lee", Email = "jordan@weddingco.com", Role = "Planning Assistant", HourlyRate = 40, IsActive = true, HiredDate = new DateTime(2023, 8, 1) },
            new Employee { Id = 3, FirstName = "Morgan", LastName = "Davis", Email = "morgan@weddingco.com", Role = "Coordinator", HourlyRate = 55, IsActive = true, HiredDate = new DateTime(2023, 1, 10) }
        );

        // EventVendors
        modelBuilder.Entity<EventVendor>().HasData(
            new EventVendor { Id = 1, CoupleId = 1, VendorId = 1, ContractedPrice = 4500, Status = BookingStatus.ContractSigned, ContractSignedDate = new DateTime(2024, 11, 5), DepositAmount = 1125, DepositPaid = true },
            new EventVendor { Id = 2, CoupleId = 1, VendorId = 3, ContractedPrice = 5800, Status = BookingStatus.DepositPaid, ContractSignedDate = new DateTime(2024, 10, 20), DepositAmount = 1450, DepositPaid = true },
            new EventVendor { Id = 3, CoupleId = 1, VendorId = 6, ContractedPrice = 18500, Status = BookingStatus.Confirmed, DepositAmount = 4625, DepositPaid = false },
            new EventVendor { Id = 4, CoupleId = 3, VendorId = 2, ContractedPrice = 7200, Status = BookingStatus.DepositPaid, ContractSignedDate = new DateTime(2024, 9, 1), DepositAmount = 1800, DepositPaid = true }
        );

        // TimeEntries
        modelBuilder.Entity<TimeEntry>().HasData(
            new TimeEntry { Id = 1, EmployeeId = 1, CoupleId = 1, ClockIn = new DateTime(2025, 1, 10, 9, 0, 0), ClockOut = new DateTime(2025, 1, 10, 12, 30, 0), Description = "Vendor meeting with florist", EntryType = TimeEntryType.VendorMeeting, IsBillable = true },
            new TimeEntry { Id = 2, EmployeeId = 2, CoupleId = 1, ClockIn = new DateTime(2025, 1, 12, 10, 0, 0), ClockOut = new DateTime(2025, 1, 12, 14, 0, 0), Description = "Timeline planning session", EntryType = TimeEntryType.Planning, IsBillable = true },
            new TimeEntry { Id = 3, EmployeeId = 1, CoupleId = 3, ClockIn = new DateTime(2025, 1, 8, 13, 0, 0), ClockOut = new DateTime(2025, 1, 8, 17, 0, 0), Description = "Final details walkthrough at venue", EntryType = TimeEntryType.ClientMeeting, IsBillable = true }
        );
    }
}
