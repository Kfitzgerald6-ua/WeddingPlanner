using Microsoft.EntityFrameworkCore;
using WeddingPlannerApi.Data;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Wedding Planner API",
        Version = "v1",
        Description = "Backend API for the Wedding Planner operations platform."
    });
});

// Use in-memory database for development; swap for SQL Server in production:
// builder.Services.AddDbContext<AppDbContext>(opts =>
//     opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseInMemoryDatabase("WeddingPlannerDb"));

builder.Services.AddCors(opts =>
{
    opts.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── App pipeline ──────────────────────────────────────────────────────────────

var app = builder.Build();

// Seed the in-memory DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Wedding Planner API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors();
app.MapControllers();

app.Run();
