# Bloom & Co. — Wedding Planner App

Full-stack wedding planning operations platform built for the MIS capstone project.

## Architecture

```
WeddingPlanner/
├── backend/
│   └── WeddingPlannerApi/          ← ASP.NET Core 8 Web API
│       ├── Program.cs               ← App entry point, DI, CORS
│       ├── Data/AppDbContext.cs      ← EF Core context + seed data
│       ├── Models/Models.cs          ← Domain entities
│       ├── DTOs/DTOs.cs              ← Request/response shapes
│       └── Controllers/
│           ├── DashboardController.cs
│           ├── CouplesController.cs
│           ├── VendorsController.cs
│           ├── EmployeesController.cs   ← Also contains TimeEntriesController
│           └── (TimeEntriesController is in EmployeesController.cs)
└── frontend/
    └── App.jsx                      ← React SPA (Vite or CRA)
```

## Backend — ASP.NET Core 8

### Setup & Run
```bash
cd backend/WeddingPlannerApi
dotnet restore
dotnet run
# API runs at https://localhost:5001
# Swagger UI at https://localhost:5001/swagger
```

### Database
- **Development**: In-memory EF Core (auto-seeded with demo data)
- **Production**: Swap for SQL Server by updating `Program.cs`:
  ```csharp
  builder.Services.AddDbContext<AppDbContext>(opts =>
      opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
  ```
  Then run:
  ```bash
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  ```

### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard` | Stats + upcoming weddings |
| GET | `/api/couples` | All couples |
| POST | `/api/couples` | Add new couple |
| PATCH | `/api/couples/{id}/stage` | Advance workflow stage |
| GET | `/api/couples/{id}/vendors` | Vendors for a couple |
| GET | `/api/couples/{id}/time-summary` | Hours billed to a couple |
| GET | `/api/vendors` | All vendors (filter by category/city) |
| POST | `/api/vendors` | Add vendor |
| POST | `/api/vendors/recommend` | AI-scored recommendations |
| POST | `/api/vendors/assign` | Assign vendor to couple |
| PATCH | `/api/vendors/bookings/{id}/status` | Update booking status |
| GET | `/api/employees` | All active employees |
| POST | `/api/employees` | Add employee |
| GET | `/api/timeentries` | Time entries (filter by employee/couple) |
| POST | `/api/timeentries/clock-in` | Start a time entry |
| PATCH | `/api/timeentries/clock-out` | End a time entry |

### AI Recommendation Algorithm (`POST /api/vendors/recommend`)
Scores vendors 0–100 using weighted factors:
- **40 pts** — Budget fit (min/max price vs. client budget)
- **30 pts** — Internal rating (0–5 → normalized)
- **15 pts** — Usage history (times used, capped at 20)
- **10 pts** — Location match (city > state)
- **5 pts** — Preferred vendor bonus

## Frontend — React

### Setup & Run
```bash
cd frontend
npm create vite@latest . -- --template react
# Move App.jsx into src/
npm install
npm run dev
```

### Views / Roles

**Planner Role:**
- **Dashboard** — KPIs, upcoming weddings, preferred vendor list
- **Clients** — All couples, search, add new, progress tracking
- **Client Detail** — Workflow stage advancement, vendor assignments, budget breakdown, notes, billable hours
- **Vendor Directory** — Full directory with filters + AI recommendation modal
- **Time Tracking** — Clock in/out, allocate hours to couples, billing totals

**Couple Role:**
- **Couple Portal** — Personalized checklist, vendor status, budget overview, planner contact

## Domain Model

```
Couple ──< EventVendor >── Vendor
Couple ──< TimeEntry >── Employee
Couple ──< Document
```

### Workflow Stages (in order)
1. Initial Consultation
2. Venue Booked
3. Vendors Selected
4. Contracts Signed
5. Planning In Progress
6. Final Details
7. Wedding Day
8. Post Wedding
9. Completed

## Sprint 1 Scope (MVP)
- [x] Core data model (Couples, Vendors, Employees, Time Entries)
- [x] Workflow stage tracking
- [x] Vendor directory with filtering
- [x] AI vendor recommendation (scoring algorithm)
- [x] Time clock with couple allocation
- [x] Budget tracking per couple
- [x] Multi-role UI (Planner + Couple Portal)

## Sprint 2 Ideas
- [ ] Document upload (contracts, inspiration images, venue layouts)
- [ ] Email/notification triggers per stage change
- [ ] Vendor portal (read-only view for vendors)
- [ ] AI image-assisted planning (bouquet/layout suggestions)
- [ ] Google Maps integration for vendor location
- [ ] Export billing report per couple (PDF)
