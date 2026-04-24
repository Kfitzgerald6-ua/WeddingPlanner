import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROLES } from "./domain/models";
import { canViewTimeEntry } from "./domain/permissions";
import { login as loginRequest, clearStoredSession, getStoredSession } from "./api/authService";
import { createCouple, getCoupleTimeSummary, getCoupleVendors, listCouples, updateCoupleStage } from "./api/couplesService";
import { getCouplePortalOverview } from "./api/couplePortalService";
import { assignVendor, createVendor, listVendors, recommendVendors } from "./api/vendorsService";
import { clockIn, clockOut, listEmployees, listTimeEntries } from "./api/timeTrackingService";

const NAV_ITEMS = {
  planner: [
    { id: "dashboard", label: "Dashboard" },
    { id: "couples", label: "Clients" },
    { id: "vendors", label: "Vendors" },
    { id: "time", label: "Time Tracking" },
  ],
  couple: [{ id: "portal", label: "Couple Portal" }],
};

const VENDOR_CATEGORIES = [
  "Venue",
  "Catering",
  "Photography",
  "Videography",
  "Florist",
  "Music",
  "Cake",
  "HairAndMakeup",
  "Officiant",
  "Transportation",
  "Lighting",
  "Decor",
  "Invitations",
  "Jewelry",
  "Other",
];

const TIME_ENTRY_TYPES = [
  "Planning",
  "VendorMeeting",
  "ClientMeeting",
  "WeddingDay",
  "Travel",
  "Administrative",
];

const stages = [
  "Initial Consultation",
  "Venue Booked",
  "Vendors Selected",
  "Contracts Signed",
  "Planning In Progress",
  "Final Details",
  "Wedding Day",
  "Post Wedding",
  "Completed",
];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');
  :root {
    --cream: #f7f3ee;
    --paper: #fcf9f4;
    --sage: #486243;
    --sage-soft: #dfe9dc;
    --sage-deep: #263726;
    --rose: #bb7b66;
    --gold: #b08a54;
    --ink: #1f1a18;
    --muted: #786e68;
    --border: #ddd4cb;
    --danger: #9f4a4a;
    --shadow: 0 16px 40px rgba(31, 26, 24, 0.08);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Jost', sans-serif;
    color: var(--ink);
    background:
      radial-gradient(circle at top left, rgba(223,233,220,0.75), transparent 32%),
      linear-gradient(180deg, #fbf8f3 0%, #f4eee7 100%);
  }
  button, input, select, textarea { font: inherit; }
  .shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 290px 1fr;
  }
  .sidebar {
    background: linear-gradient(180deg, rgba(38,55,38,0.98), rgba(52,76,52,0.97));
    color: #edf3ea;
    padding: 28px 22px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .brand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0;
  }
  .brand-sub {
    margin-top: 6px;
    font-size: 12px;
    color: rgba(237,243,234,0.7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .sidebar-section {
    font-size: 11px;
    color: rgba(237,243,234,0.64);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .nav-item {
    width: 100%;
    border: 0;
    background: transparent;
    color: rgba(237,243,234,0.78);
    text-align: left;
    padding: 12px 14px;
    border-radius: 12px;
    cursor: pointer;
  }
  .nav-item.active {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }
  .sidebar-footer {
    margin-top: auto;
    display: grid;
    gap: 10px;
    font-size: 13px;
    color: rgba(237,243,234,0.78);
  }
  .layout {
    padding: 28px 34px 40px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 24px;
  }
  .title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 600;
  }
  .subtitle {
    margin-top: 6px;
    color: var(--muted);
    font-size: 14px;
  }
  .panel {
    background: rgba(252,249,244,0.92);
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: var(--shadow);
  }
  .panel.pad { padding: 22px; }
  .grid {
    display: grid;
    gap: 18px;
  }
  .grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .stat {
    padding: 22px;
    border-radius: 18px;
    background: rgba(255,255,255,0.75);
    border: 1px solid var(--border);
  }
  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    color: var(--sage-deep);
  }
  .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 18px;
  }
  .btn {
    border: 0;
    border-radius: 999px;
    padding: 8px 13px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn.primary { background: var(--sage); color: white; }
  .btn.secondary { background: transparent; border: 1px solid var(--border); color: var(--ink); }
  .btn.danger { background: var(--rose); color: white; }
  .btn:disabled { opacity: 0.6; cursor: wait; }
  .fields {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .field {
    display: grid;
    gap: 6px;
  }
  .field.full { grid-column: 1 / -1; }
  .field label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .field input, .field select, .field textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 11px 14px;
    background: white;
  }
  .field textarea { min-height: 96px; resize: vertical; }
  .banner {
    padding: 12px 16px;
    border-radius: 14px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  .banner.error { background: rgba(159,74,74,0.12); color: var(--danger); border: 1px solid rgba(159,74,74,0.18); }
  .banner.success { background: rgba(72,98,67,0.12); color: var(--sage-deep); border: 1px solid rgba(72,98,67,0.16); }
  .table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .table th, .table td { padding: 12px 14px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
  .table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
  .list {
    display: grid;
    gap: 14px;
  }
  .card-row {
    display: grid;
    gap: 10px;
    padding: 18px;
    border-radius: 16px;
    background: rgba(255,255,255,0.72);
    border: 1px solid var(--border);
  }
  .split {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
  }
  .muted { color: var(--muted); }
  .pill {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--sage-soft);
    color: var(--sage-deep);
    font-size: 12px;
    font-weight: 600;
  }
  .login-wrap {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .login-card {
    width: min(480px, 100%);
    padding: 28px;
  }
  .empty {
    padding: 28px;
    text-align: center;
    color: var(--muted);
  }
  @media (max-width: 980px) {
    .shell { grid-template-columns: 1fr; }
    .sidebar { padding-bottom: 12px; }
    .layout { padding: 20px; }
    .grid.cols-2, .grid.cols-3, .fields { grid-template-columns: 1fr; }
  }
`;

const fmt = {
  currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);
  },
  date(value) {
    return new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  },
};

function normalizeRole(role) {
  return String(role || "").toLowerCase();
}

function buildViewerUser(session) {
  if (!session?.user) return { id: null, role: ROLES.PLANNER };
  const role = normalizeRole(session.user.role);
  if (role === ROLES.COUPLE) {
    return { id: `couple-${session.user.coupleId ?? "self"}`, role, coupleId: session.user.coupleId ?? null };
  }
  return { id: `emp-${session.user.employeeId ?? "self"}`, role };
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(() => getStoredSession());
  const [activeView, setActiveView] = useState("dashboard");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couples, setCouples] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [coupleVendorsById, setCoupleVendorsById] = useState({});
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [selectedCoupleSummary, setSelectedCoupleSummary] = useState(null);
  const [portalOverview, setPortalOverview] = useState(null);

  const role = normalizeRole(session?.user?.role);
  const isAuthenticated = Boolean(session?.token);
  const handleLogout = useCallback(() => {
    clearStoredSession();
    setSession(null);
    setCouples([]);
    setVendors([]);
    setEmployees([]);
    setTimeEntries([]);
    setPortalOverview(null);
    setSelectedCouple(null);
    setSelectedCoupleSummary(null);
    setCoupleVendorsById({});
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (location.pathname !== "/login") navigate("/login", { replace: true });
      return;
    }

    if (role === ROLES.COUPLE) {
      if (location.pathname !== "/portal") navigate("/portal", { replace: true });
      setActiveView("portal");
      return;
    }

    if (location.pathname === "/login" || location.pathname === "/portal") {
      navigate("/planner", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, role]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        if (role === ROLES.COUPLE) {
          const overview = await getCouplePortalOverview();
          if (!ignore) setPortalOverview(overview);
        } else {
          const [couplesData, vendorsData, employeesData, timeEntriesData] = await Promise.all([
            listCouples(),
            listVendors(),
            listEmployees(),
            listTimeEntries(),
          ]);

          const vendorEntries = await Promise.all(
            couplesData.map(async (couple) => [couple.id, await getCoupleVendors(couple.id)]),
          );

          if (!ignore) {
            setCouples(couplesData);
            setVendors(vendorsData);
            setEmployees(employeesData);
            setTimeEntries(timeEntriesData);
            setCoupleVendorsById(Object.fromEntries(vendorEntries));
          }
        }
      } catch (loadError) {
        if (!ignore) {
          if (loadError.status === 401) {
            handleLogout();
            setError("Your session expired. Please sign in again.");
          } else {
            setError(loadError.message || "We couldn't load the latest workspace data.");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [handleLogout, isAuthenticated, role]);

  const viewerUser = useMemo(() => buildViewerUser(session), [session]);
  const visibleEntries = useMemo(
    () => timeEntries.filter((entry) => canViewTimeEntry(viewerUser, { ...entry, employeeUserId: `emp-${entry.employeeId}` })),
    [timeEntries, viewerUser],
  );

  const assignments = useMemo(
    () =>
      Object.values(coupleVendorsById)
        .flat()
        .map((assignment) => ({
          coupleId: assignment.coupleId,
          vendorId: assignment.vendorId,
        })),
    [coupleVendorsById],
  );

  async function handleLogin(credentials) {
    setError(null);
    setFeedback(null);
    setLoading(true);
    try {
      const nextSession = await loginRequest(credentials);
      setSession(nextSession);
      setSelectedCouple(null);
      setSelectedCoupleSummary(null);
      setFeedback("Signed in successfully.");
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCouple(payload) {
    const created = await createCouple(payload);
    setCouples((prev) => [...prev, created].sort((a, b) => new Date(a.weddingDate) - new Date(b.weddingDate)));
    setFeedback(`Added ${created.partner1Name} & ${created.partner2Name}.`);
  }

  async function handleSelectCouple(couple) {
    setSelectedCouple(couple);
    setSelectedCoupleSummary(null);
    try {
      const [vendorsData, summaryData] = await Promise.all([
        getCoupleVendors(couple.id),
        getCoupleTimeSummary(couple.id),
      ]);
      setCoupleVendorsById((prev) => ({ ...prev, [couple.id]: vendorsData }));
      setSelectedCoupleSummary(summaryData);
    } catch (detailError) {
      setError(detailError.message || "Unable to load couple details.");
    }
  }

  async function handleStageChange(coupleId, newStage) {
    const updated = await updateCoupleStage(coupleId, newStage);
    setCouples((prev) => prev.map((couple) => (couple.id === coupleId ? updated : couple)));
    setSelectedCouple((prev) => (prev?.id === coupleId ? updated : prev));
    setFeedback(`Updated stage to ${updated.currentStageLabel}.`);
  }

  async function handleCreateVendor(payload) {
    await createVendor(payload);
    const vendorsData = await listVendors();
    setVendors(vendorsData);
    setFeedback(`Added ${payload.name} to the vendor directory.`);
  }

  async function handleAssignVendor(payload) {
    const assignment = await assignVendor(payload);
    setCoupleVendorsById((prev) => ({
      ...prev,
      [assignment.coupleId]: [...(prev[assignment.coupleId] ?? []), assignment],
    }));
    setFeedback(`Assigned ${assignment.vendorName} to ${assignment.coupleName}.`);
  }

  async function handleRecommend(payload) {
    return recommendVendors(payload);
  }

  async function handleClockIn(payload) {
    const created = await clockIn(payload);
    setTimeEntries((prev) => [created, ...prev]);
    setFeedback(`Clocked in ${created.employeeName}.`);
  }

  async function handleClockOut(entryId) {
    const updated = await clockOut(entryId);
    setTimeEntries((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
    setFeedback("Clock-out saved.");
  }

  if (!isAuthenticated) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
    return (
      <>
        <style>{style}</style>
        <LoginView onSubmit={handleLogin} loading={loading} error={error} />
      </>
    );
  }

  if (role === ROLES.COUPLE) {
    return (
      <>
        <style>{style}</style>
        <div className="shell">
          <Sidebar
            items={NAV_ITEMS.couple}
            activeView="portal"
            onChange={() => {}}
            session={session}
            onLogout={handleLogout}
          />
          <div className="layout">
            {feedback && <Banner type="success">{feedback}</Banner>}
            {error && <Banner type="error">{error}</Banner>}
            <CouplePortalView overview={portalOverview} loading={loading} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{style}</style>
      <div className="shell">
        <Sidebar
          items={NAV_ITEMS.planner}
          activeView={activeView}
          onChange={(nextView) => {
            setActiveView(nextView);
            setSelectedCouple(null);
            setSelectedCoupleSummary(null);
          }}
          session={session}
          onLogout={handleLogout}
        />
        <div className="layout">
          {feedback && <Banner type="success">{feedback}</Banner>}
          {error && <Banner type="error">{error}</Banner>}
          {activeView === "dashboard" && <DashboardView couples={couples} vendors={vendors} employees={employees} loading={loading} />}
          {activeView === "couples" && (
            <CouplesView
              couples={couples}
              selectedCouple={selectedCouple}
              selectedCoupleSummary={selectedCoupleSummary}
              assignedVendors={selectedCouple ? coupleVendorsById[selectedCouple.id] ?? [] : []}
              onCreateCouple={handleCreateCouple}
              onSelectCouple={handleSelectCouple}
              onBack={() => {
                setSelectedCouple(null);
                setSelectedCoupleSummary(null);
              }}
              onStageChange={handleStageChange}
              loading={loading}
            />
          )}
          {activeView === "vendors" && (
            <VendorsView
              vendors={vendors}
              couples={couples}
              assignments={assignments}
              onCreateVendor={handleCreateVendor}
              onAssignVendor={handleAssignVendor}
              onRecommend={handleRecommend}
            />
          )}
          {activeView === "time" && (
            <TimeTrackingView
              couples={couples}
              employees={employees}
              entries={visibleEntries}
              user={viewerUser}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}
        </div>
      </div>
    </>
  );
}

function Sidebar({ items, activeView, onChange, session, onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <h1 className="brand-title">Bloom & Co.</h1>
        <div className="brand-sub">Wedding Planning Studio</div>
      </div>
      <div className="sidebar-section">Workspace</div>
      <div className="nav-list">
        {items.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <div>Signed in as {session.user.displayName}</div>
        <div className="muted">{normalizeRole(session.user.role)}</div>
        <div className="muted">Connected to the live API with role-aware access.</div>
        <button className="btn secondary" onClick={onLogout}>Log Out</button>
      </div>
    </aside>
  );
}

function LoginView({ onSubmit, loading, error }) {
  const [email, setEmail] = useState("manager@bloomco.com");
  const [password, setPassword] = useState("Password123!");

  function submit(event) {
    event.preventDefault();
    onSubmit({ email: email.trim(), password });
  }

  return (
    <div className="login-wrap">
      <style>{style}</style>
      <form className="panel pad login-card" onSubmit={submit}>
        <div className="title" style={{ fontSize: 38 }}>Bloom & Co. Access</div>
        <div className="subtitle">Sign in with a manager, planner, or couple account to reach the correct portal.</div>
        {error && <Banner type="error">{error}</Banner>}
        <div className="fields" style={{ marginTop: 18 }}>
          <div className="field full">
            <label>Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </div>
          <div className="field full">
            <label>Password</label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </div>
        </div>
        <div className="banner success" style={{ marginTop: 18 }}>
          Demo credentials: `manager@bloomco.com`, `planner@bloomco.com`, or any seeded couple email with `Password123!`.
        </div>
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function DashboardView({ couples, vendors, employees, loading }) {
  const now = new Date();
  const upcoming = couples
    .map((couple) => {
      const weddingDate = new Date(couple.weddingDate);
      const daysUntil = Math.ceil((weddingDate - now) / 86400000);
      return { ...couple, daysUntil };
    })
    .filter((couple) => couple.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
  const preferredVendors = vendors.filter((vendor) => vendor.isPreferred).length;
  const avgBudget = couples.length
    ? Math.round(couples.reduce((sum, couple) => sum + (couple.budget || 0), 0) / couples.length)
    : 0;
  const stageCounts = stages.map((stage, idx) => ({
    stage,
    count: couples.filter((couple) => couple.currentStage === idx).length,
  }));
  const maxStageCount = Math.max(1, ...stageCounts.map((item) => item.count));

  return (
    <>
      <Header title="Dashboard" subtitle="Connected overview of current clients, vendors, and staff activity." />
      <div className="grid cols-3">
        <Stat label="Active Clients" value={loading ? "..." : couples.length} />
        <Stat label="Vendor Directory" value={loading ? "..." : vendors.length} />
        <Stat label="Team Members" value={loading ? "..." : employees.length} />
      </div>
      <div className="grid cols-3" style={{ marginTop: 18 }}>
        <Stat label="Preferred Vendors" value={loading ? "..." : preferredVendors} />
        <Stat label="Avg Client Budget" value={loading ? "..." : fmt.currency(avgBudget)} />
        <Stat label="Upcoming Weddings" value={loading ? "..." : upcoming.length} />
      </div>
      <div className="grid cols-2" style={{ marginTop: 18 }}>
        <div className="panel pad">
          <div className="title" style={{ fontSize: 28 }}>Upcoming Timeline</div>
          <div className="subtitle">Nearest weddings by countdown and stage.</div>
          <div className="list" style={{ marginTop: 14 }}>
            {upcoming.slice(0, 5).map((couple) => (
              <div key={couple.id} className="card-row">
                <div className="split">
                  <strong>{couple.partner1Name} & {couple.partner2Name}</strong>
                  <span className="pill">{couple.daysUntil} days</span>
                </div>
                <div className="muted">{fmt.date(couple.weddingDate)} · {couple.weddingLocation}</div>
                <div className="muted">Stage: {couple.currentStageLabel}</div>
              </div>
            ))}
            {upcoming.length === 0 && <div className="empty">No future weddings yet.</div>}
          </div>
        </div>
        <div className="panel pad">
          <div className="title" style={{ fontSize: 28 }}>Workflow Visibility</div>
          <div className="subtitle">Current client distribution across planning stages.</div>
          <div className="list" style={{ marginTop: 14 }}>
            {stageCounts.filter((item) => item.count > 0).map((item) => (
              <div key={item.stage}>
                <div className="split">
                  <span>{item.stage}</span>
                  <span className="pill">{item.count}</span>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(72,98,67,0.14)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.count / maxStageCount) * 100}%`,
                      height: "100%",
                      background: "var(--sage)",
                    }}
                  />
                </div>
              </div>
            ))}
            {stageCounts.every((item) => item.count === 0) && <div className="empty">No client stage data available.</div>}
          </div>
        </div>
      </div>
    </>
  );
}

function CouplesView({
  couples,
  selectedCouple,
  selectedCoupleSummary,
  assignedVendors,
  onCreateCouple,
  onSelectCouple,
  onBack,
  onStageChange,
  loading,
}) {
  const [form, setForm] = useState({
    partner1Name: "",
    partner2Name: "",
    email: "",
    phone: "",
    weddingDate: "",
    weddingLocation: "",
    guestCount: "",
    budget: "",
    notes: "",
  });
  const [localError, setLocalError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!form.partner1Name.trim() || !form.partner2Name.trim() || !form.email.trim() || !form.weddingDate) {
      setLocalError("Partner names, email, and wedding date are required.");
      return;
    }
    setLocalError("");
    setSaving(true);
    try {
      await onCreateCouple({
        ...form,
        guestCount: Number(form.guestCount) || 0,
        budget: Number(form.budget) || 0,
      });
      setForm({
        partner1Name: "",
        partner2Name: "",
        email: "",
        phone: "",
        weddingDate: "",
        weddingLocation: "",
        guestCount: "",
        budget: "",
        notes: "",
      });
    } finally {
      setSaving(false);
    }
  }

  if (selectedCouple) {
    const totalSpend = assignedVendors.reduce((sum, vendor) => sum + vendor.contractedPrice, 0);
    return (
      <>
        <Header title={`${selectedCouple.partner1Name} & ${selectedCouple.partner2Name}`} subtitle={`${fmt.date(selectedCouple.weddingDate)} · ${selectedCouple.weddingLocation}`} actions={<button className="btn secondary" onClick={onBack}>Back to Clients</button>} />
        <div className="grid cols-2">
          <div className="panel pad">
            <div className="split">
              <div>
                <div className="subtitle">Current workflow stage</div>
                <div className="title" style={{ fontSize: 28 }}>{selectedCouple.currentStageLabel}</div>
              </div>
              <div className="pill">Stage {selectedCouple.currentStage + 1} / {stages.length}</div>
            </div>
            <div className="toolbar" style={{ marginTop: 18 }}>
              <button className="btn secondary" disabled={selectedCouple.currentStage === 0} onClick={() => onStageChange(selectedCouple.id, selectedCouple.currentStage - 1)}>Previous</button>
              <button className="btn primary" disabled={selectedCouple.currentStage >= stages.length - 1} onClick={() => onStageChange(selectedCouple.id, selectedCouple.currentStage + 1)}>Advance Stage</button>
            </div>
          </div>
          <div className="panel pad">
            <div className="subtitle">Budget snapshot</div>
            <div className="title" style={{ fontSize: 30 }}>{fmt.currency(totalSpend)} committed</div>
            <div className="muted">of {fmt.currency(selectedCouple.budget)} total budget</div>
            {selectedCoupleSummary && (
              <div className="muted" style={{ marginTop: 14 }}>
                {selectedCoupleSummary.totalHours.toFixed(1)} billable hours tracked, {fmt.currency(selectedCoupleSummary.totalCost)} internal cost.
              </div>
            )}
          </div>
        </div>
        <div className="panel pad" style={{ marginTop: 18 }}>
          <div className="split">
            <div>
              <div className="title" style={{ fontSize: 28 }}>Assigned Vendors</div>
              <div className="subtitle">Live assignment and booking data from the API.</div>
            </div>
          </div>
          <table className="table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Status</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              {assignedVendors.length === 0 ? (
                <tr><td colSpan={4} className="empty">No vendors assigned yet.</td></tr>
              ) : assignedVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.category}</td>
                  <td>{vendor.statusLabel}</td>
                  <td>{fmt.currency(vendor.contractedPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Clients" subtitle="Create new couples, then drill into their workflow, vendors, and time summary." />
      <div className="grid cols-2">
        <div className="panel pad">
          <div className="title" style={{ fontSize: 28 }}>Portfolio</div>
          <div className="subtitle">{loading ? "Loading couples..." : `${couples.length} couples connected`}</div>
          <div className="list" style={{ marginTop: 16 }}>
            {couples.map((couple) => (
              <button key={couple.id} className="card-row" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => onSelectCouple(couple)}>
                <div className="split">
                  <strong>{couple.partner1Name} & {couple.partner2Name}</strong>
                  <span className="pill">{couple.currentStageLabel}</span>
                </div>
                <div className="muted">{fmt.date(couple.weddingDate)} · {couple.weddingLocation}</div>
              </button>
            ))}
          </div>
        </div>
        <form className="panel pad" onSubmit={submit}>
          <div className="title" style={{ fontSize: 28 }}>Add Client</div>
          <div className="subtitle">Validation is now explicit before data is sent to the backend.</div>
          {localError && <Banner type="error">{localError}</Banner>}
          <div className="fields" style={{ marginTop: 16 }}>
            <Field label="Partner 1 Name"><input value={form.partner1Name} onChange={(event) => setForm({ ...form, partner1Name: event.target.value })} /></Field>
            <Field label="Partner 2 Name"><input value={form.partner2Name} onChange={(event) => setForm({ ...form, partner2Name: event.target.value })} /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Wedding Date"><input type="date" value={form.weddingDate} onChange={(event) => setForm({ ...form, weddingDate: event.target.value })} /></Field>
            <Field label="Location"><input value={form.weddingLocation} onChange={(event) => setForm({ ...form, weddingLocation: event.target.value })} /></Field>
            <Field label="Guest Count"><input type="number" value={form.guestCount} onChange={(event) => setForm({ ...form, guestCount: event.target.value })} /></Field>
            <Field label="Budget"><input type="number" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} /></Field>
            <Field label="Notes" full><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
          </div>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Create Client"}</button>
        </form>
      </div>
    </>
  );
}

function VendorsView({ vendors, couples, assignments, onCreateVendor, onAssignVendor, onRecommend }) {
  const [form, setForm] = useState({
    name: "",
    category: "Photography",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "AL",
    typicalPriceMin: "",
    typicalPriceMax: "",
    isPreferred: false,
    notes: "",
  });
  const [assignForm, setAssignForm] = useState({
    vendorId: "",
    coupleId: "",
    contractedPrice: "",
    depositAmount: "",
    notes: "",
  });
  const [recommendForm, setRecommendForm] = useState({
    category: "Photography",
    city: "Tuscaloosa",
    state: "AL",
    budgetMin: "0",
    budgetMax: "5000",
    guestCount: "150",
  });
  const [recommended, setRecommended] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  async function submitVendor(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setLocalError("Vendor name is required.");
      return;
    }
    if (!form.address.trim()) {
      setLocalError("Vendor address is required.");
      return;
    }
    setLocalError("");
    setSubmitting(true);
    try {
      await onCreateVendor({
        ...form,
        category: VENDOR_CATEGORIES.indexOf(form.category),
        typicalPriceMin: Number(form.typicalPriceMin) || 0,
        typicalPriceMax: Number(form.typicalPriceMax) || 0,
      });
      setForm({
        name: "",
        category: "Photography",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "AL",
        typicalPriceMin: "",
        typicalPriceMax: "",
        isPreferred: false,
        notes: "",
      });
    } catch (vendorError) {
      setLocalError(vendorError.message || "Unable to create vendor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitAssignment(event) {
    event.preventDefault();
    if (!assignForm.vendorId || !assignForm.coupleId) {
      setLocalError("Choose both a vendor and a client before assigning.");
      return;
    }
    setLocalError("");
    await onAssignVendor({
      vendorId: Number(assignForm.vendorId),
      coupleId: Number(assignForm.coupleId),
      contractedPrice: Number(assignForm.contractedPrice) || 0,
      depositAmount: Number(assignForm.depositAmount) || 0,
      notes: assignForm.notes.trim(),
    });
    setAssignForm({ vendorId: "", coupleId: "", contractedPrice: "", depositAmount: "", notes: "" });
  }

  async function runRecommend(event) {
    event.preventDefault();
    const results = await onRecommend({
      ...recommendForm,
      category: VENDOR_CATEGORIES.indexOf(recommendForm.category),
      budgetMin: Number(recommendForm.budgetMin) || 0,
      budgetMax: Number(recommendForm.budgetMax) || 0,
      guestCount: Number(recommendForm.guestCount) || 0,
    });
    setRecommended(results);
  }

  return (
    <>
      <Header title="Vendors" subtitle="Create vendors, run recommendations, and assign them to client records through the backend." />
      {localError && <Banner type="error">{localError}</Banner>}
      <div className="grid cols-2">
        <form className="panel pad" onSubmit={submitVendor}>
          <div className="title" style={{ fontSize: 28 }}>Add Vendor</div>
          <div className="fields" style={{ marginTop: 16 }}>
            <Field label="Business Name"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Category"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{VENDOR_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field>
            <Field label="Contact Name"><input value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Website"><input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://example.com" /></Field>
            <Field label="Address"><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></Field>
            <Field label="City"><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></Field>
            <Field label="State"><input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} maxLength={2} /></Field>
            <Field label="Typical Min Price"><input type="number" value={form.typicalPriceMin} onChange={(event) => setForm({ ...form, typicalPriceMin: event.target.value })} /></Field>
            <Field label="Typical Max Price"><input type="number" value={form.typicalPriceMax} onChange={(event) => setForm({ ...form, typicalPriceMax: event.target.value })} /></Field>
            <Field label="Notes" full><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
          </div>
          <button className="btn primary" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Vendor"}</button>
        </form>
        <div className="grid">
          <form className="panel pad" onSubmit={submitAssignment}>
            <div className="title" style={{ fontSize: 28 }}>Assign Vendor</div>
            <div className="fields" style={{ marginTop: 16 }}>
              <Field label="Vendor"><select value={assignForm.vendorId} onChange={(event) => setAssignForm({ ...assignForm, vendorId: event.target.value })}><option value="">Choose vendor</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></Field>
              <Field label="Client"><select value={assignForm.coupleId} onChange={(event) => setAssignForm({ ...assignForm, coupleId: event.target.value })}><option value="">Choose client</option>{couples.map((couple) => <option key={couple.id} value={couple.id}>{couple.partner1Name} & {couple.partner2Name}</option>)}</select></Field>
              <Field label="Contracted Price"><input type="number" value={assignForm.contractedPrice} onChange={(event) => setAssignForm({ ...assignForm, contractedPrice: event.target.value })} /></Field>
              <Field label="Deposit Amount"><input type="number" value={assignForm.depositAmount} onChange={(event) => setAssignForm({ ...assignForm, depositAmount: event.target.value })} /></Field>
              <Field label="Notes" full><textarea value={assignForm.notes} onChange={(event) => setAssignForm({ ...assignForm, notes: event.target.value })} /></Field>
            </div>
            <button className="btn primary" type="submit">Assign Vendor</button>
          </form>
          <form className="panel pad" onSubmit={runRecommend}>
            <div className="title" style={{ fontSize: 28 }}>Recommend Vendors</div>
            <div className="fields" style={{ marginTop: 16 }}>
              <Field label="Category"><select value={recommendForm.category} onChange={(event) => setRecommendForm({ ...recommendForm, category: event.target.value })}>{VENDOR_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field>
              <Field label="City"><input value={recommendForm.city} onChange={(event) => setRecommendForm({ ...recommendForm, city: event.target.value })} /></Field>
              <Field label="Max Budget"><input type="number" value={recommendForm.budgetMax} onChange={(event) => setRecommendForm({ ...recommendForm, budgetMax: event.target.value })} /></Field>
              <Field label="Guest Count"><input type="number" value={recommendForm.guestCount} onChange={(event) => setRecommendForm({ ...recommendForm, guestCount: event.target.value })} /></Field>
            </div>
            <button className="btn secondary" type="submit">Find Matches</button>
            <div className="list" style={{ marginTop: 16 }}>
              {recommended.map((vendor) => (
                <div key={vendor.id} className="card-row">
                  <strong>{vendor.name}</strong>
                  <div className="muted">{vendor.categoryLabel} · {vendor.city}</div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
      <div className="panel pad" style={{ marginTop: 18 }}>
        <div className="title" style={{ fontSize: 28 }}>Directory</div>
        <table className="table" style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.categoryLabel}</td>
                <td>{vendor.city}, {vendor.state}</td>
                <td>
                  {assignments
                    .filter((assignment) => assignment.vendorId === vendor.id)
                    .map((assignment) => couples.find((couple) => couple.id === assignment.coupleId))
                    .filter(Boolean)
                    .map((couple) => `${couple.partner1Name} & ${couple.partner2Name}`)
                    .join(", ") || "Unassigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TimeTrackingView({ couples, employees, entries, user, onClockIn, onClockOut }) {
  const defaultEmployeeId =
    user.role === ROLES.PLANNER
      ? user.id?.replace("emp-", "") ?? ""
      : employees[0]
        ? String(employees[0].id)
        : "";
  const [form, setForm] = useState({
    employeeId: defaultEmployeeId,
    coupleId: "",
    entryType: "Planning",
    description: "",
  });
  const [localError, setLocalError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const employeeId = form.employeeId || defaultEmployeeId;
    if (!employeeId || !form.coupleId || !form.description.trim()) {
      setLocalError("Employee, client, and description are required.");
      return;
    }
    setLocalError("");
    await onClockIn({
      employeeId: Number(employeeId),
      coupleId: Number(form.coupleId),
      entryType: TIME_ENTRY_TYPES.indexOf(form.entryType),
      description: form.description.trim(),
    });
    setForm((prev) => ({ ...prev, description: "" }));
  }

  const totalHours = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);

  return (
    <>
      <Header title="Time Tracking" subtitle="Live clock-in, clock-out, and history backed by role-aware API access." />
      {localError && <Banner type="error">{localError}</Banner>}
      <div className="grid cols-2">
        <form className="panel pad" onSubmit={submit}>
          <div className="title" style={{ fontSize: 28 }}>Clock In</div>
          <div className="fields" style={{ marginTop: 16 }}>
            <Field label="Employee">
              <select value={form.employeeId || defaultEmployeeId} onChange={(event) => setForm({ ...form, employeeId: event.target.value })} disabled={user.role === ROLES.PLANNER}>
                <option value="">Choose employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.fullName}</option>
                ))}
              </select>
            </Field>
            <Field label="Client">
              <select value={form.coupleId} onChange={(event) => setForm({ ...form, coupleId: event.target.value })}>
                <option value="">Choose client</option>
                {couples.map((couple) => (
                  <option key={couple.id} value={couple.id}>{couple.partner1Name} & {couple.partner2Name}</option>
                ))}
              </select>
            </Field>
            <Field label="Entry Type">
              <select value={form.entryType} onChange={(event) => setForm({ ...form, entryType: event.target.value })}>
                {TIME_ENTRY_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </Field>
            <Field label="Description" full><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
          </div>
          <button className="btn primary" type="submit">Clock In</button>
        </form>
        <div className="panel pad">
          <div className="title" style={{ fontSize: 28 }}>History</div>
          <div className="subtitle">{totalHours.toFixed(1)} tracked hours visible to this role.</div>
          <table className="table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Client</th>
                <th>Description</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={5} className="empty">No time entries yet.</td></tr>
              ) : entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.employeeName}</td>
                  <td>{entry.coupleName}</td>
                  <td>{entry.description || "No description"}</td>
                  <td>{entry.clockOut ? `${Number(entry.hoursWorked || 0).toFixed(1)}h` : "Active"}</td>
                  <td>
                    {!entry.clockOut && <button className="btn secondary" onClick={() => onClockOut(entry.id)}>Clock Out</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CouplePortalView({ overview, loading }) {
  if (loading && !overview) {
    return <div className="panel pad">Loading your wedding portal...</div>;
  }

  if (!overview) {
    return <div className="panel pad">No couple portal data is available for this account.</div>;
  }

  const couple = overview.couple;
  const committed = overview.vendors.reduce((sum, vendor) => sum + vendor.contractedPrice, 0);

  return (
    <>
      <Header title="Couple Portal" subtitle={`Personalized for ${couple.partner1Name} & ${couple.partner2Name}. This portal is scoped to the logged-in couple only.`} />
      <div className="grid cols-2">
        <div className="panel pad">
          <div className="title" style={{ fontSize: 30 }}>{fmt.date(couple.weddingDate)}</div>
          <div className="subtitle">{couple.weddingLocation} · {couple.guestCount} guests</div>
          <div className="banner success" style={{ marginTop: 16 }}>
            Your current stage is {couple.currentStageLabel}.
          </div>
        </div>
        <div className="panel pad">
          <div className="title" style={{ fontSize: 30 }}>{fmt.currency(couple.budget - committed)} remaining</div>
          <div className="subtitle">{fmt.currency(committed)} committed across confirmed vendor work.</div>
        </div>
      </div>
      <div className="panel pad" style={{ marginTop: 18 }}>
        <div className="title" style={{ fontSize: 28 }}>Your Vendors</div>
        <table className="table" style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Status</th>
              <th>Contracted Price</th>
            </tr>
          </thead>
          <tbody>
            {overview.vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.vendorName}</td>
                <td>{vendor.category}</td>
                <td>{vendor.statusLabel}</td>
                <td>{fmt.currency(vendor.contractedPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Header({ title, subtitle, actions }) {
  return (
    <div className="header">
      <div>
        <h2 className="title">{title}</h2>
        <div className="subtitle">{subtitle}</div>
      </div>
      {actions}
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat panel">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Banner({ children, type }) {
  return <div className={`banner ${type}`}>{children}</div>;
}

export default AppShell;
