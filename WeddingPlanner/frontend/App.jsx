import { useState } from "react";
import brandImage from "./assets/hero.png";

// ── Mock data (mirrors C# seed data) ────────────────────────────────────────

const mockCouples = [
  { id: 1, partner1Name: "Emma Thompson", partner2Name: "Liam Nguyen", email: "emma.liam@email.com", phone: "205-555-1001", weddingDate: "2025-06-14", weddingLocation: "Tuscaloosa, AL", guestCount: 150, budget: 45000, currentStage: 2, currentStageLabel: "VendorsSelected", notes: "Outdoor garden ceremony preferred. Allergic to lilies." },
  { id: 2, partner1Name: "Sophia Martinez", partner2Name: "Alex Johnson", email: "sophia.alex@email.com", phone: "205-555-1002", weddingDate: "2025-09-20", weddingLocation: "Birmingham, AL", guestCount: 200, budget: 65000, currentStage: 0, currentStageLabel: "InitialConsultation", notes: "Luxury aesthetic. Black-tie optional." },
  { id: 3, partner1Name: "Olivia Chen", partner2Name: "Noah Williams", email: "olivia.noah@email.com", phone: "205-555-1003", weddingDate: "2025-04-05", weddingLocation: "Tuscaloosa, AL", guestCount: 80, budget: 28000, currentStage: 5, currentStageLabel: "FinalDetails", notes: "Intimate ceremony. Bohemian style." },
];

const mockVendors = [
  { id: 1, name: "Magnolia Blooms", category: 4, categoryLabel: "Florist", contactName: "Sarah Mitchell", email: "sarah@magnoliablooms.com", phone: "205-555-0101", city: "Tuscaloosa", state: "AL", typicalPriceMin: 2500, typicalPriceMax: 8000, timesUsed: 12, internalRating: 4.8, isPreferred: true, notes: "Excellent with organic arrangements. Always on time." },
  { id: 2, name: "Tuscaloosa Grand Ballroom", category: 0, categoryLabel: "Venue", contactName: "James Porter", email: "events@tgb.com", phone: "205-555-0202", city: "Tuscaloosa", state: "AL", typicalPriceMin: 5000, typicalPriceMax: 15000, timesUsed: 8, internalRating: 4.6, isPreferred: true, notes: "Capacity 300. Full kitchen. Excellent staff." },
  { id: 3, name: "Golden Hour Photography", category: 2, categoryLabel: "Photography", contactName: "Lena Cruz", email: "lena@goldenhour.photo", phone: "205-555-0303", city: "Birmingham", state: "AL", typicalPriceMin: 3500, typicalPriceMax: 7000, timesUsed: 20, internalRating: 4.9, isPreferred: true, notes: "Our go-to photographer. Exceptional editorial style." },
  { id: 4, name: "Sweet Layers Bakery", category: 6, categoryLabel: "Cake", contactName: "Devon Hughes", email: "devon@sweetlayers.com", phone: "205-555-0404", city: "Tuscaloosa", state: "AL", typicalPriceMin: 800, typicalPriceMax: 3000, timesUsed: 15, internalRating: 4.7, isPreferred: false, notes: "Custom cakes, dietary accommodations available." },
  { id: 5, name: "Harmony Strings Quartet", category: 5, categoryLabel: "Music", contactName: "Rachel Kim", email: "rachel@harmonystrings.com", phone: "205-555-0505", city: "Tuscaloosa", state: "AL", typicalPriceMin: 1200, typicalPriceMax: 3500, timesUsed: 6, internalRating: 4.5, isPreferred: false, notes: "Classical and contemporary. Also offers DJ services." },
  { id: 6, name: "Elegance Catering Co.", category: 1, categoryLabel: "Catering", contactName: "Marcus Bell", email: "marcus@elegancecatering.com", phone: "205-555-0606", city: "Tuscaloosa", state: "AL", typicalPriceMin: 8000, typicalPriceMax: 25000, timesUsed: 10, internalRating: 4.6, isPreferred: true, notes: "Farm-to-table specialists. Can handle up to 400 guests." },
];

const mockEmployees = [
  { id: 1, firstName: "Rachel", lastName: "Torres", fullName: "Rachel Torres", email: "rachel@weddingco.com", role: "Lead Planner", hourlyRate: 75, isActive: true },
  { id: 2, firstName: "Jordan", lastName: "Lee", fullName: "Jordan Lee", email: "jordan@weddingco.com", role: "Planning Assistant", hourlyRate: 40, isActive: true },
  { id: 3, firstName: "Morgan", lastName: "Davis", fullName: "Morgan Davis", email: "morgan@weddingco.com", role: "Coordinator", hourlyRate: 55, isActive: true },
];

const mockTimeEntries = [
  { id: 1, employeeId: 1, employeeName: "Rachel Torres", coupleId: 1, coupleName: "Emma Thompson & Liam Nguyen", clockIn: "2025-01-10T09:00:00", clockOut: "2025-01-10T12:30:00", hoursWorked: 3.5, description: "Vendor meeting with florist", entryType: 1, entryTypeLabel: "VendorMeeting", isBillable: true },
  { id: 2, employeeId: 2, employeeName: "Jordan Lee", coupleId: 1, coupleName: "Emma Thompson & Liam Nguyen", clockIn: "2025-01-12T10:00:00", clockOut: "2025-01-12T14:00:00", hoursWorked: 4, description: "Timeline planning session", entryType: 0, entryTypeLabel: "Planning", isBillable: true },
  { id: 3, employeeId: 1, employeeName: "Rachel Torres", coupleId: 3, coupleName: "Olivia Chen & Noah Williams", clockIn: "2025-01-08T13:00:00", clockOut: "2025-01-08T17:00:00", hoursWorked: 4, description: "Final details walkthrough at venue", entryType: 2, entryTypeLabel: "ClientMeeting", isBillable: true },
];

const stages = ["Initial Consultation", "Venue Booked", "Vendors Selected", "Contracts Signed", "Planning In Progress", "Final Details", "Wedding Day", "Post Wedding", "Completed"];
const categoryIcons = { Venue: "🏛", Catering: "🍽", Photography: "📸", Videography: "🎬", Florist: "💐", Music: "🎵", Cake: "🎂", HairAndMakeup: "💄", Officiant: "📜", Transportation: "🚗", Lighting: "💡", Decor: "✨", Invitations: "✉️", Jewelry: "💍", Other: "📦" };

// ── Styles ───────────────────────────────────────────────────────────────────

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --cream: #f7f3ee;
    --warm-white: #faf8f5;
    --sage: #4a6741;
    --sage-light: #7a9b72;
    --sage-dark: #2d4229;
    --sage-pale: #e8efe6;
    --rose: #c4856a;
    --rose-light: #f0d5c8;
    --gold: #b8935a;
    --gold-light: #f0e0c8;
    --ink: #1c1c1c;
    --ink-mid: #4a4a4a;
    --ink-light: #7a7a7a;
    --border: #ddd8d0;
    --shadow: 0 2px 20px rgba(28,28,28,0.08);
    --shadow-lg: 0 8px 40px rgba(28,28,28,0.12);
  }

  body {
    font-family: 'Jost', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar {
    width: 240px;
    min-width: 240px;
    background: var(--sage-dark);
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow-y: auto;
  }
  .sidebar-brand {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(232,239,230,0.35);
  }
  .brand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: #e8efe6;
    letter-spacing: 0.02em;
    line-height: 1.2;
  }
  .brand-sub {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sage-light);
    margin-top: 4px;
  }
  .sidebar-section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(122,155,114,0.7);
    padding: 20px 24px 8px;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 24px;
    cursor: pointer;
    color: rgba(232,239,230,0.7);
    font-size: 13.5px;
    font-weight: 400;
    letter-spacing: 0.01em;
    transition: all 0.15s;
    border-left: 3px solid transparent;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: #e8efe6; }
  .nav-item.active { background: rgba(255,255,255,0.08); color: #e8efe6; border-left-color: var(--sage-light); font-weight: 500; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  /* Main content */
  .main { flex: 1; overflow-y: auto; background: var(--cream); }
  .page-header {
    padding: 32px 40px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--warm-white);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--ink);
  }
  .page-subtitle {
    font-size: 13px;
    color: var(--ink-light);
    margin-top: 4px;
    font-weight: 300;
  }
  .content-area { padding: 32px 40px; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    border-radius: 3px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }
  .btn-primary { background: var(--sage); color: white; }
  .btn-primary:hover { background: var(--sage-dark); }
  .btn-outline { background: transparent; color: var(--sage); border: 1.5px solid var(--sage); }
  .btn-outline:hover { background: var(--sage-pale); }
  .btn-rose { background: var(--rose); color: white; }
  .btn-rose:hover { background: #b8735a; }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-ghost { background: transparent; color: var(--ink-mid); padding: 6px 10px; }
  .btn-ghost:hover { background: var(--border); }

  /* Cards */
  .card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: var(--shadow);
  }
  .card-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
  }
  .card-body { padding: 20px 24px; }

  /* Grid layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .stack { display: flex; flex-direction: column; gap: 16px; }

  /* Stat cards */
  .stat-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--sage);
  }
  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 300;
    color: var(--sage-dark);
    line-height: 1;
  }
  .stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-top: 6px;
  }
  .stat-note { font-size: 12px; color: var(--ink-light); margin-top: 4px; }

  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  th {
    text-align: left;
    padding: 10px 16px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-light);
    border-bottom: 2px solid var(--border);
    background: var(--cream);
  }
  td { padding: 14px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(74,103,65,0.03); }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
  }
  .badge-sage { background: var(--sage-pale); color: var(--sage-dark); }
  .badge-rose { background: var(--rose-light); color: #8b4530; }
  .badge-gold { background: var(--gold-light); color: #8b6030; }
  .badge-ink { background: #ebebeb; color: var(--ink-mid); }

  /* Stage pill */
  .stage-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 500;
  }

  /* Couple card */
  .couple-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 22px 24px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow);
  }
  .couple-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: var(--sage-light); }
  .couple-names {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .couple-date { font-size: 12.5px; color: var(--ink-light); margin-bottom: 14px; }
  .couple-meta { display: flex; gap: 16px; flex-wrap: wrap; }
  .couple-meta-item { font-size: 12.5px; color: var(--ink-mid); }

  /* Progress bar */
  .progress-track { background: var(--border); border-radius: 4px; height: 6px; overflow: hidden; margin-top: 14px; }
  .progress-fill { height: 100%; border-radius: 4px; background: var(--sage); transition: width 0.4s; }

  /* Vendor card */
  .vendor-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px;
    transition: all 0.2s;
    box-shadow: var(--shadow);
  }
  .vendor-card:hover { border-color: var(--sage-light); box-shadow: var(--shadow-lg); }
  .vendor-cat-icon { font-size: 24px; margin-bottom: 10px; }
  .vendor-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 500; }
  .vendor-contact { font-size: 12.5px; color: var(--ink-light); margin-top: 2px; }
  .vendor-price { font-size: 13px; color: var(--sage); font-weight: 500; margin-top: 8px; }
  .vendor-stars { color: var(--gold); font-size: 13px; margin-top: 6px; }

  /* Rating stars */
  .stars span { font-size: 13px; }

  /* Timeline */
  .timeline { position: relative; }
  .timeline-item { display: flex; gap: 16px; margin-bottom: 0; }
  .timeline-line { display: flex; flex-direction: column; align-items: center; }
  .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--sage); border: 2px solid white; box-shadow: 0 0 0 2px var(--sage); flex-shrink: 0; margin-top: 4px; }
  .timeline-dot.empty { background: var(--border); box-shadow: 0 0 0 2px var(--border); }
  .timeline-connector { width: 2px; background: var(--border); flex: 1; margin: 4px 0; min-height: 28px; }
  .timeline-content { padding-bottom: 20px; }
  .timeline-stage { font-size: 13.5px; font-weight: 500; }
  .timeline-stage.done { color: var(--sage); }
  .timeline-stage.current { color: var(--rose); }
  .timeline-stage.future { color: var(--ink-light); }

  /* Form elements */
  .form-group { margin-bottom: 16px; }
  label { display: block; font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-mid); margin-bottom: 6px; }
  input, select, textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    font-family: 'Jost', sans-serif;
    font-size: 13.5px;
    color: var(--ink);
    background: white;
    transition: border-color 0.15s;
    outline: none;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--sage); }
  textarea { resize: vertical; min-height: 80px; }

  /* Modal overlay */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(28,28,28,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    animation: fadeIn 0.15s;
  }
  .modal {
    background: var(--warm-white);
    border-radius: 6px;
    width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.2s;
  }
  .modal-header {
    padding: 24px 28px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; }
  .modal-body { padding: 24px 28px; }
  .modal-footer { padding: 16px 28px 24px; display: flex; justify-content: flex-end; gap: 12px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Tab nav */
  .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 24px; }
  .tab {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-light);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.15s;
  }
  .tab:hover { color: var(--ink); }
  .tab.active { color: var(--sage-dark); border-bottom-color: var(--sage); }

  /* Search bar */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .search-bar input { max-width: 280px; margin: 0; }

  /* AI recommendation badge */
  .ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: linear-gradient(135deg, #2d4229, #4a6741);
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
  }

  /* Time tracker */
  .time-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .time-employee { font-weight: 500; font-size: 14px; }
  .time-meta { font-size: 12px; color: var(--ink-light); margin-top: 2px; }
  .time-hours { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: var(--sage); }

  /* Workflow stepper */
  .workflow-stepper { display: flex; gap: 0; overflow-x: auto; }
  .workflow-step {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  .step-content { text-align: center; flex: 1; padding: 12px 8px; }
  .step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
    margin: 0 auto 6px;
  }
  .step-num.done { background: var(--sage); color: white; }
  .step-num.current { background: var(--rose); color: white; }
  .step-num.future { background: var(--border); color: var(--ink-light); }
  .step-label { font-size: 11px; font-weight: 500; color: var(--ink-light); line-height: 1.3; }
  .step-label.done { color: var(--sage); }
  .step-label.current { color: var(--rose); }
  .step-arrow { color: var(--border); font-size: 16px; flex-shrink: 0; }

  /* Couple portal */
  .portal-welcome {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    color: var(--sage-dark);
    margin-bottom: 4px;
  }
  .portal-date {
    font-size: 13px;
    color: var(--ink-light);
    margin-bottom: 28px;
  }
  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .checklist-item:last-child { border-bottom: none; }
  .check-box {
    width: 20px; height: 20px;
    border-radius: 3px;
    border: 2px solid var(--border);
    flex-shrink: 0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    margin-top: 2px;
  }
  .check-box.checked { background: var(--sage); border-color: var(--sage); color: white; font-size: 12px; }

  /* Role switcher */
  .role-switcher {
    display: flex;
    gap: 8px;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .role-btn {
    padding: 6px 12px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    text-transform: uppercase;
  }
  .role-btn.active { background: var(--sage-light); color: white; }
  .role-btn.inactive { background: rgba(255,255,255,0.08); color: rgba(232,239,230,0.6); }
  .role-btn.inactive:hover { background: rgba(255,255,255,0.12); color: rgba(232,239,230,0.9); }

  .empty-state { text-align: center; padding: 48px 24px; color: var(--ink-light); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  .login-shell {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .login-card {
    width: 100%;
    max-width: 460px;
    background: var(--warm-white);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    border-radius: 6px;
    padding: 26px;
  }
  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    margin-bottom: 4px;
    color: var(--sage-dark);
  }
  .login-subtitle {
    font-size: 13px;
    color: var(--ink-light);
    margin-bottom: 16px;
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = {
  currency: (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n),
  date: (d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  dateShort: (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  daysUntil: (d) => Math.ceil((new Date(d) - new Date()) / 86400000),
};

const stars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function StageBadge({ stage }) {
  const colors = ["#a8b5a0", "#7a9b72", "#5d8854", "#44783a", "#2b6820", "#c4856a", "#12581a", "#7a9b72", "#4a4a4a"];
  const bg = colors[stage] + "22";
  const color = colors[stage];
  return (
    <span className="stage-pill" style={{ background: bg, color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
      {stages[stage]}
    </span>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ couples, vendors }) {
  const upcoming90 = couples.filter(c => {
    const days = fmt.daysUntil(c.weddingDate);
    return days >= 0 && days <= 90;
  });
  const upcomingSorted = [...couples]
    .map((c) => ({ ...c, daysUntil: fmt.daysUntil(c.weddingDate) }))
    .filter((c) => c.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of all active clients and operations</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-light)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
      </div>
      <div className="content-area">
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { value: couples.length, label: "Total Clients", note: "Active couples" },
            { value: upcoming90.length, label: "Upcoming (90 days)", note: "Weddings this season" },
            { value: vendors.length, label: "Vendor Directory", note: "Managed vendors" },
            { value: mockEmployees.length, label: "Team Members", note: "Active staff" },
          ].map((s, i) => (
            <div className="stat-card" key={i} style={{ "--before-color": "var(--sage)" }}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-note">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Upcoming Weddings</span>
            </div>
            <div style={{ padding: "0 0 4px" }}>
              {upcomingSorted.map(c => {
                const days = c.daysUntil;
                return (
                  <div key={c.id} style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500 }}>
                        {c.partner1Name} & {c.partner2Name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-light)", marginTop: 2 }}>{fmt.dateShort(c.weddingDate)} · {c.weddingLocation}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: days <= 30 ? "var(--rose)" : "var(--sage)" }}>
                        {days <= 0 ? "Today!" : `${days}d`}
                      </div>
                      <div style={{ marginTop: 4 }}><StageBadge stage={c.currentStage} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Preferred Vendors</span>
            </div>
            <div style={{ padding: "0 0 4px" }}>
              {vendors.filter(v => v.isPreferred).slice(0, 5).map(v => (
                <div key={v.id} style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{categoryIcons[v.categoryLabel] || "📦"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-light)" }}>{v.categoryLabel} · {v.city}</div>
                  </div>
                  <div style={{ color: "var(--gold)", fontSize: 13 }}>{stars(v.internalRating)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Couples List ──────────────────────────────────────────────────────────────

function CouplesList({ couples, setCouples, onSelectCouple }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ partner1Name: "", partner2Name: "", email: "", phone: "", weddingDate: "", weddingLocation: "", guestCount: "", budget: "", notes: "" });

  const filtered = couples.filter(c =>
    `${c.partner1Name} ${c.partner2Name}`.toLowerCase().includes(search.toLowerCase()) ||
    c.weddingLocation.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const newCouple = { ...form, id: Date.now(), currentStage: 0, currentStageLabel: "InitialConsultation", guestCount: Number(form.guestCount), budget: Number(form.budget), createdAt: new Date().toISOString() };
    setCouples([...couples, newCouple]);
    setShowModal(false);
    setForm({ partner1Name: "", partner2Name: "", email: "", phone: "", weddingDate: "", weddingLocation: "", guestCount: "", budget: "", notes: "" });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Clients</div>
          <div className="page-subtitle">{couples.length} couples in your portfolio</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Client</button>
      </div>
      <div className="content-area">
        <div className="search-bar">
          <input placeholder="Search by name or location…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        </div>
        <div className="grid-2">
          {filtered.map(c => {
            const days = fmt.daysUntil(c.weddingDate);
            const progress = (c.currentStage / (stages.length - 1)) * 100;
            return (
              <div className="couple-card" key={c.id} onClick={() => onSelectCouple(c)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div className="couple-names">{c.partner1Name} & {c.partner2Name}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: days <= 30 ? "var(--rose)" : "var(--sage)", background: days <= 30 ? "var(--rose-light)" : "var(--sage-pale)", padding: "3px 10px", borderRadius: 20 }}>
                    {days <= 0 ? "Wedding Day!" : `${days} days`}
                  </span>
                </div>
                <div className="couple-date">{fmt.date(c.weddingDate)} · {c.weddingLocation}</div>
                <div className="couple-meta">
                  <span className="couple-meta-item">👥 {c.guestCount} guests</span>
                  <span className="couple-meta-item">💰 {fmt.currency(c.budget)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <StageBadge stage={c.currentStage} />
                  <span style={{ fontSize: 11, color: "var(--ink-light)" }}>Stage {c.currentStage + 1} of {stages.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <Modal title="Add New Client" onClose={() => setShowModal(false)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Client</button>
          </>
        }>
          <div className="grid-2">
            <div className="form-group">
              <label>Partner 1 Name</label>
              <input value={form.partner1Name} onChange={e => setForm({ ...form, partner1Name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Partner 2 Name</label>
              <input value={form.partner2Name} onChange={e => setForm({ ...form, partner2Name: e.target.value })} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Wedding Date</label>
              <input type="date" value={form.weddingDate} onChange={e => setForm({ ...form, weddingDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.weddingLocation} onChange={e => setForm({ ...form, weddingLocation: e.target.value })} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Guest Count</label>
              <input type="number" value={form.guestCount} onChange={e => setForm({ ...form, guestCount: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Budget ($)</label>
              <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Couple Detail ─────────────────────────────────────────────────────────────

function CoupleDetail({ couple, onBack, onUpdateStage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const assignedVendors = [
    { id: 1, vendorId: 1, vendorName: "Magnolia Blooms", category: "Florist", contractedPrice: 4500, status: "ContractSigned", depositPaid: true, depositAmount: 1125 },
    { id: 2, vendorId: 3, vendorName: "Golden Hour Photography", category: "Photography", contractedPrice: 5800, status: "DepositPaid", depositPaid: true, depositAmount: 1450 },
    { id: 3, vendorId: 6, vendorName: "Elegance Catering Co.", category: "Catering", contractedPrice: 18500, status: "Confirmed", depositPaid: false, depositAmount: 4625 },
  ].filter(() => couple.id === 1);

  const totalSpend = assignedVendors.reduce((s, v) => s + v.contractedPrice, 0);
  const budgetPct = Math.round((totalSpend / couple.budget) * 100);

  const statusBadge = (s) => {
    const map = { ContractSigned: "badge-sage", DepositPaid: "badge-gold", Confirmed: "badge-ink", Inquiry: "badge-ink" };
    return <span className={`badge ${map[s] || "badge-ink"}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 8 }}>← Back to Clients</button>
          <div className="page-title">{couple.partner1Name} & {couple.partner2Name}</div>
          <div className="page-subtitle">{fmt.date(couple.weddingDate)} · {couple.weddingLocation} · {couple.guestCount} guests</div>
        </div>
        <StageBadge stage={couple.currentStage} />
      </div>

      <div className="content-area">
        {/* Stage workflow */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-light)", marginBottom: 14 }}>Wedding Journey</div>
            <div className="workflow-stepper">
              {stages.map((s, i) => {
                const state = i < couple.currentStage ? "done" : i === couple.currentStage ? "current" : "future";
                return (
                  <div className="workflow-step" key={i}>
                    <div className="step-content">
                      <div className={`step-num ${state}`}>{i < couple.currentStage ? "✓" : i + 1}</div>
                      <div className={`step-label ${state}`}>{s}</div>
                    </div>
                    {i < stages.length - 1 && <div className="step-arrow">›</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {couple.currentStage > 0 && <button className="btn btn-outline btn-sm" onClick={() => onUpdateStage(couple.id, couple.currentStage - 1)}>← Previous Stage</button>}
              {couple.currentStage < stages.length - 1 && <button className="btn btn-primary btn-sm" onClick={() => onUpdateStage(couple.id, couple.currentStage + 1)}>Advance Stage →</button>}
            </div>
          </div>
        </div>

        <div className="tabs">
          {["overview", "vendors", "budget", "notes"].map(t => (
            <div key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header"><span className="card-title">Contact Info</span></div>
              <div className="card-body stack" style={{ gap: 12 }}>
                {[["Email", couple.email], ["Phone", couple.phone], ["Location", couple.weddingLocation], ["Guest Count", `${couple.guestCount} guests`]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                    <span style={{ color: "var(--ink-light)", fontWeight: 500 }}>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Budget Snapshot</span></div>
              <div className="card-body">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "var(--sage-dark)" }}>{fmt.currency(totalSpend)}</div>
                <div style={{ fontSize: 12, color: "var(--ink-light)", marginBottom: 12 }}>of {fmt.currency(couple.budget)} budget</div>
                <div className="progress-track" style={{ height: 8, marginTop: 0 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(budgetPct, 100)}%`, background: budgetPct > 90 ? "var(--rose)" : "var(--sage)" }} />
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: budgetPct > 90 ? "var(--rose)" : "var(--sage)", fontWeight: 500 }}>{budgetPct}% committed</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Assigned Vendors</span>
              <button className="btn btn-primary btn-sm">+ Assign Vendor</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Vendor</th><th>Category</th><th>Price</th><th>Deposit</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {assignedVendors.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ink-light)", padding: 32 }}>No vendors assigned yet</td></tr>
                  ) : assignedVendors.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 500 }}>{v.vendorName}</td>
                      <td><span className="badge badge-ink">{categoryIcons[v.category]} {v.category}</span></td>
                      <td>{fmt.currency(v.contractedPrice)}</td>
                      <td>
                        <span style={{ color: v.depositPaid ? "var(--sage)" : "var(--rose)", fontWeight: 500 }}>
                          {v.depositPaid ? `✓ ${fmt.currency(v.depositAmount)} paid` : `${fmt.currency(v.depositAmount)} pending`}
                        </span>
                      </td>
                      <td>{statusBadge(v.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header"><span className="card-title">Budget Breakdown</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Category</th><th>Amount</th><th>% of Budget</th></tr></thead>
                  <tbody>
                    {assignedVendors.map(v => (
                      <tr key={v.id}>
                        <td>{v.category}</td>
                        <td>{fmt.currency(v.contractedPrice)}</td>
                        <td>{Math.round((v.contractedPrice / couple.budget) * 100)}%</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 600 }}>
                      <td>Total Committed</td>
                      <td>{fmt.currency(totalSpend)}</td>
                      <td>{budgetPct}%</td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--sage)" }}>Remaining</td>
                      <td style={{ color: "var(--sage)" }}>{fmt.currency(couple.budget - totalSpend)}</td>
                      <td style={{ color: "var(--sage)" }}>{100 - budgetPct}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Staff Hours</span></div>
              <div className="card-body">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "var(--sage-dark)" }}>7.5h</div>
                <div style={{ fontSize: 12, color: "var(--ink-light)", marginBottom: 16 }}>billable hours logged</div>
                {mockTimeEntries.filter(t => t.coupleId === couple.id).map(t => (
                  <div key={t.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                    <div style={{ fontWeight: 500 }}>{t.employeeName}</div>
                    <div style={{ color: "var(--ink-light)", fontSize: 12, marginTop: 2 }}>{t.description} · {t.hoursWorked}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="card">
            <div className="card-header"><span className="card-title">Notes & Special Requirements</span></div>
            <div className="card-body">
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-mid)", background: "var(--cream)", padding: 16, borderRadius: 4, border: "1px solid var(--border)" }}>
                {couple.notes || "No notes added yet."}
              </div>
              <div style={{ marginTop: 16 }}>
                <textarea placeholder="Add a note…" style={{ height: 100 }} />
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary btn-sm">Save Note</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Vendor Directory ──────────────────────────────────────────────────────────

function VendorDirectory({ vendors }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showAI, setShowAI] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiForm, setAiForm] = useState({ category: "Photography", budget: "5000", city: "Tuscaloosa" });

  const cats = ["All", ...new Set(vendors.map(v => v.categoryLabel))];
  const filtered = vendors.filter(v =>
    (catFilter === "All" || v.categoryLabel === catFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()))
  );

  const runAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      const results = vendors
        .filter(v => v.categoryLabel === aiForm.category)
        .sort((a, b) => b.internalRating - a.internalRating)
        .slice(0, 3);
      setAiResults(results);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Vendor Directory</div>
          <div className="page-subtitle">{vendors.length} vendors · {vendors.filter(v => v.isPreferred).length} preferred</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowAI(true)}>✨ AI Recommend</button>
          <button className="btn btn-primary">+ Add Vendor</button>
        </div>
      </div>
      <div className="content-area">
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <input placeholder="Search vendors…" value={search} onChange={e => setSearch(e.target.value)} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ maxWidth: 180 }}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {aiResults.length > 0 && (
          <div style={{ background: "var(--sage-pale)", border: "1px solid var(--sage-light)", borderRadius: 4, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span className="ai-badge">✨ AI Recommended</span>
              <span style={{ fontSize: 13, color: "var(--sage-dark)" }}>Top picks for {aiForm.category} in {aiForm.city}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setAiResults([])} style={{ marginLeft: "auto" }}>✕</button>
            </div>
            <div className="grid-3">
              {aiResults.map(v => (
                <div className="vendor-card" key={v.id} style={{ borderColor: "var(--sage-light)", borderWidth: 2 }}>
                  <div className="vendor-cat-icon">{categoryIcons[v.categoryLabel] || "📦"}</div>
                  <div className="vendor-name">{v.name}</div>
                  <div className="vendor-contact">{v.contactName} · {v.city}</div>
                  <div className="vendor-stars">{stars(v.internalRating)} <span style={{ color: "var(--ink-light)", fontSize: 11 }}>({v.internalRating})</span></div>
                  <div className="vendor-price">{fmt.currency(v.typicalPriceMin)} – {fmt.currency(v.typicalPriceMax)}</div>
                  {v.isPreferred && <div style={{ marginTop: 8 }}><span className="badge badge-sage">⭐ Preferred</span></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid-3">
          {filtered.map(v => (
            <div className="vendor-card" key={v.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="vendor-cat-icon">{categoryIcons[v.categoryLabel] || "📦"}</div>
                {v.isPreferred && <span className="badge badge-sage">Preferred</span>}
              </div>
              <div className="vendor-name">{v.name}</div>
              <div className="vendor-contact">{v.categoryLabel} · {v.contactName}</div>
              <div style={{ fontSize: 12, color: "var(--ink-light)", marginTop: 4 }}>📍 {v.city}, {v.state}</div>
              <div className="vendor-stars">{stars(v.internalRating)} <span style={{ color: "var(--ink-light)", fontSize: 11 }}>({v.timesUsed} uses)</span></div>
              <div className="vendor-price">{fmt.currency(v.typicalPriceMin)} – {fmt.currency(v.typicalPriceMax)}</div>
              {v.notes && <div style={{ fontSize: 12, color: "var(--ink-light)", marginTop: 8, lineHeight: 1.5, borderTop: "1px solid var(--border)", paddingTop: 8 }}>{v.notes}</div>}
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm">View</button>
                <button className="btn btn-primary btn-sm">Assign</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAI && (
        <Modal title="✨ AI Vendor Recommendation" onClose={() => setShowAI(false)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAI(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { runAI(); setShowAI(false); }} disabled={aiLoading}>
              {aiLoading ? "Finding…" : "Find Vendors"}
            </button>
          </>
        }>
          <p style={{ fontSize: 13.5, color: "var(--ink-mid)", marginBottom: 20, lineHeight: 1.6 }}>
            Our AI scores vendors based on budget fit, internal rating, usage history, and location to surface the best options for your client.
          </p>
          <div className="form-group">
            <label>Category Needed</label>
            <select value={aiForm.category} onChange={e => setAiForm({ ...aiForm, category: e.target.value })}>
              {cats.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Client City</label>
              <input value={aiForm.city} onChange={e => setAiForm({ ...aiForm, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Budget ($)</label>
              <input type="number" value={aiForm.budget} onChange={e => setAiForm({ ...aiForm, budget: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Time Tracking ─────────────────────────────────────────────────────────────

function TimeTracking({ couples }) {
  const [entries, setEntries] = useState(mockTimeEntries);
  const [showClock, setShowClock] = useState(false);
  const [form, setForm] = useState({ employeeId: "1", coupleId: "1", entryType: "Planning", description: "" });
  const [timeMessage, setTimeMessage] = useState("");

  const computeWorkedHours = (clockInIso, clockOutIso) => {
    const diffMs = new Date(clockOutIso).getTime() - new Date(clockInIso).getTime();
    const rawHours = diffMs / 3600000;
    return Math.max(0, Math.round(rawHours * 10) / 10);
  };

  const handleClockIn = () => {
    const employeeId = Number(form.employeeId);
    const hasOpenEntry = entries.some((entry) => entry.employeeId === employeeId && !entry.clockOut);
    if (hasOpenEntry) {
      setTimeMessage("This employee already has an active session. Clock out first.");
      return;
    }

    const emp = mockEmployees.find(e => e.id === Number(form.employeeId));
    const couple = couples.find(c => c.id === Number(form.coupleId));
    const newEntry = {
      id: Date.now(),
      employeeId: Number(form.employeeId),
      employeeName: emp?.fullName || "",
      coupleId: Number(form.coupleId),
      coupleName: `${couple?.partner1Name} & ${couple?.partner2Name}`,
      clockIn: new Date().toISOString(),
      clockOut: null,
      hoursWorked: null,
      description: form.description,
      entryTypeLabel: form.entryType,
      isBillable: true,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setTimeMessage(`${emp?.fullName || "Employee"} clocked in successfully.`);
    setShowClock(false);
  };

  const handleClockOut = (entryId) => {
    const nowIso = new Date().toISOString();
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId || entry.clockOut) {
          return entry;
        }
        return {
          ...entry,
          clockOut: nowIso,
          hoursWorked: computeWorkedHours(entry.clockIn, nowIso),
        };
      }),
    );
    setTimeMessage("Clock out saved.");
  };

  const totalHours = entries.reduce((s, e) => s + (e.hoursWorked || 0), 0);
  const billableHours = entries.filter(e => e.isBillable).reduce((s, e) => s + (e.hoursWorked || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Time Tracking</div>
          <div className="page-subtitle">Log and allocate staff hours to client events</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowClock(true)}>⏱ Clock In</button>
      </div>
      <div className="content-area">
        <div className="grid-3" style={{ marginBottom: 28 }}>
          {[
            { v: `${totalHours.toFixed(1)}h`, l: "Total Hours", n: "All entries" },
            { v: `${billableHours.toFixed(1)}h`, l: "Billable Hours", n: "Charged to clients" },
            { v: fmt.currency(entries.filter(e => e.isBillable).reduce((s, e) => s + (e.hoursWorked || 0) * (mockEmployees.find(em => em.id === e.employeeId)?.hourlyRate || 0), 0)), l: "Total Billing Value", n: "Based on hourly rates" },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-value">{s.v}</div>
              <div className="stat-label">{s.l}</div>
              <div className="stat-note">{s.n}</div>
            </div>
          ))}
        </div>
        {timeMessage && (
          <div style={{ marginBottom: 14, fontSize: 13, color: "var(--sage-dark)", fontWeight: 500 }}>
            {timeMessage}
          </div>
        )}

        <div className="card">
          <div className="card-header"><span className="card-title">Recent Entries</span></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Employee</th><th>Client</th><th>Type</th><th>Description</th><th>Hours</th><th>Billable</th><th>Action</th></tr>
              </thead>
              <tbody>
                {entries.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.employeeName}</td>
                    <td style={{ fontSize: 12.5 }}>{t.coupleName}</td>
                    <td><span className="badge badge-ink">{t.entryTypeLabel}</span></td>
                    <td style={{ color: "var(--ink-mid)", maxWidth: 200 }}>{t.description}</td>
                    <td style={{ fontWeight: 500, color: "var(--sage)" }}>{t.hoursWorked ? `${t.hoursWorked}h` : <span style={{ color: "var(--rose)" }}>Active</span>}</td>
                    <td>{t.isBillable ? <span style={{ color: "var(--sage)" }}>✓ Yes</span> : <span style={{ color: "var(--ink-light)" }}>No</span>}</td>
                    <td>
                      {!t.clockOut ? (
                        <button className="btn btn-outline btn-sm" onClick={() => handleClockOut(t.id)}>Clock Out</button>
                      ) : (
                        <span style={{ color: "var(--ink-light)", fontSize: 12 }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showClock && (
        <Modal title="Clock In" onClose={() => setShowClock(false)} footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowClock(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleClockIn}>Clock In</button>
          </>
        }>
          <div className="form-group">
            <label>Employee</label>
            <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
              {mockEmployees.map(em => <option key={em.id} value={em.id}>{em.fullName} ({em.role})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Client / Event</label>
            <select value={form.coupleId} onChange={e => setForm({ ...form, coupleId: e.target.value })}>
              {couples.map(c => <option key={c.id} value={c.id}>{c.partner1Name} & {c.partner2Name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Entry Type</label>
            <select value={form.entryType} onChange={e => setForm({ ...form, entryType: e.target.value })}>
              {["Planning", "VendorMeeting", "ClientMeeting", "WeddingDay", "Travel", "Administrative"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What are you working on?" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Couple Portal ─────────────────────────────────────────────────────────────

function CouplePortal({ couples }) {
  const couple = couples[0];
  const [checks, setChecks] = useState({ venue: true, florist: true, photographer: true, caterer: false, cake: false, music: false, attire: true, invitations: false, honeymoon: false });

  const toggleCheck = (k) => setChecks({ ...checks, [k]: !checks[k] });
  const checkItems = [
    ["venue", "Book your venue"],
    ["florist", "Choose florist and floral design"],
    ["photographer", "Confirm photographer"],
    ["caterer", "Finalize catering menu and headcount"],
    ["cake", "Order wedding cake"],
    ["music", "Book band or DJ"],
    ["attire", "Order wedding attire"],
    ["invitations", "Send invitations (at least 8 weeks before)"],
    ["honeymoon", "Book honeymoon travel"],
  ];
  const done = Object.values(checks).filter(Boolean).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Couple Portal</div>
          <div className="page-subtitle">Guided planning view for {couple.partner1Name} & {couple.partner2Name}</div>
        </div>
        <span className="badge badge-sage" style={{ fontSize: 12, padding: "6px 14px" }}>Demo — {couple.partner1Name}'s View</span>
      </div>
      <div className="content-area">
        <div className="portal-welcome">Hello, {couple.partner1Name} 💐</div>
        <div className="portal-date">Your big day is {fmt.date(couple.weddingDate)} — {fmt.daysUntil(couple.weddingDate)} days away!</div>

        <div className="grid-2">
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <span className="card-title">Your Planning Checklist</span>
                <span style={{ fontSize: 13, color: "var(--ink-light)" }}>{done}/{checkItems.length} complete</span>
              </div>
              <div className="card-body" style={{ padding: "8px 24px" }}>
                <div className="progress-track" style={{ marginBottom: 16, marginTop: 0 }}>
                  <div className="progress-fill" style={{ width: `${(done / checkItems.length) * 100}%` }} />
                </div>
                {checkItems.map(([k, label]) => (
                  <div className="checklist-item" key={k}>
                    <div className={`check-box ${checks[k] ? "checked" : ""}`} onClick={() => toggleCheck(k)}>
                      {checks[k] && "✓"}
                    </div>
                    <span style={{ fontSize: 13.5, textDecoration: checks[k] ? "line-through" : "none", color: checks[k] ? "var(--ink-light)" : "var(--ink)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <div className="card-header"><span className="card-title">Your Vendors</span></div>
              <div style={{ padding: "0 0 8px" }}>
                {[
                  { name: "Magnolia Blooms", cat: "Florist", status: "Contract Signed ✓", color: "var(--sage)" },
                  { name: "Golden Hour Photography", cat: "Photography", status: "Deposit Paid ✓", color: "var(--sage)" },
                  { name: "Elegance Catering Co.", cat: "Catering", status: "Confirmed — deposit pending", color: "var(--rose)" },
                ].map(v => (
                  <div key={v.name} style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13.5 }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-light)" }}>{v.cat}</div>
                      </div>
                      <div style={{ fontSize: 12, color: v.color, fontWeight: 500 }}>{v.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Budget Overview</span></div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--ink-light)" }}>Total Budget</span>
                  <span style={{ fontWeight: 600 }}>{fmt.currency(couple.budget)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--ink-light)" }}>Committed</span>
                  <span style={{ fontWeight: 600, color: "var(--rose)" }}>{fmt.currency(28800)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--ink-light)" }}>Remaining</span>
                  <span style={{ fontWeight: 600, color: "var(--sage)" }}>{fmt.currency(couple.budget - 28800)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Your Planner</span></div>
              <div className="card-body" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--sage-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👩</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Rachel Torres</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-light)" }}>Lead Planner · rachel@weddingco.com</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>Send Message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [accountType, setAccountType] = useState("manager");
  const [userRole, setUserRole] = useState("planner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = () => {
    const loginRole = accountType === "manager" ? "manager" : userRole;
    const displayName = email.trim() || (loginRole === "couple" ? "Couple User" : "Team User");
    // TODO: Replace this mock auth with real API auth + token handling.
    onLogin({ role: loginRole, name: displayName });
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-title">Bloom & Co. Access</div>
        <div className="login-subtitle">Manager and user sign-in for the Wedding Planner MVP</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            className={`btn btn-sm ${accountType === "manager" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setAccountType("manager")}
          >
            Manager Login
          </button>
          <button
            className={`btn btn-sm ${accountType === "user" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setAccountType("user")}
          >
            User Login
          </button>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@bloomco.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        </div>

        {accountType === "user" && (
          <div className="form-group">
            <label>User Role</label>
            <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
              <option value="planner">Planner</option>
              <option value="couple">Couple</option>
            </select>
          </div>
        )}

        <button className="btn btn-primary" onClick={submitLogin} style={{ width: "100%", justifyContent: "center" }}>
          Sign In
        </button>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", icon: "◻", label: "Dashboard", role: "planner" },
  { id: "couples", icon: "♡", label: "Clients", role: "planner" },
  { id: "vendors", icon: "✦", label: "Vendors", role: "planner" },
  { id: "time", icon: "◷", label: "Time Tracking", role: "planner" },
  { id: "portal", icon: "❧", label: "Couple Portal", role: "couple" },
];

export default function App() {
  const [couples, setCouples] = useState(mockCouples);
  const [vendors] = useState(mockVendors);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [role, setRole] = useState("planner");
  const [sessionUser, setSessionUser] = useState(null);

  const updateStage = (id, newStage) => {
    setCouples(couples.map(c => c.id === id ? { ...c, currentStage: newStage, currentStageLabel: stages[newStage] } : c));
    if (selectedCouple?.id === id) setSelectedCouple({ ...selectedCouple, currentStage: newStage });
  };

  const plannerNav = navItems.filter(n => n.role === "planner");
  const coupleNav = navItems.filter(n => n.role === "couple");
  const isOperationsRole = role === "planner" || role === "manager";

  const renderContent = () => {
    if (selectedCouple && activeView === "couples") {
      return <CoupleDetail couple={selectedCouple} onBack={() => setSelectedCouple(null)} onUpdateStage={updateStage} />;
    }
    switch (activeView) {
      case "dashboard": return <Dashboard couples={couples} vendors={vendors} />;
      case "couples": return <CouplesList couples={couples} setCouples={setCouples} onSelectCouple={(c) => setSelectedCouple(c)} />;
      case "vendors": return <VendorDirectory vendors={vendors} />;
      case "time": return <TimeTracking couples={couples} />;
      case "portal": return <CouplePortal couples={couples} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{style}</style>
      {!sessionUser ? (
        <LoginPage
          onLogin={({ role: loginRole, name }) => {
            setSessionUser({ role: loginRole, name });
            setRole(loginRole);
            setActiveView(loginRole === "couple" ? "portal" : "dashboard");
          }}
        />
      ) : (
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-row">
              <div className="brand-title">Bloom & Co.</div>
              <img src={brandImage} alt="Bloom & Co. mark" className="brand-logo" />
            </div>
            <div className="brand-sub">Event Planning Studio</div>
          </div>

          <div className="role-switcher">
            <button className={`role-btn ${role === "manager" ? "active" : "inactive"}`} onClick={() => { setRole("manager"); setActiveView("dashboard"); }}>Manager</button>
            <button className={`role-btn ${role === "planner" ? "active" : "inactive"}`} onClick={() => { setRole("planner"); setActiveView("dashboard"); }}>Planner</button>
            <button className={`role-btn ${role === "couple" ? "active" : "inactive"}`} onClick={() => { setRole("couple"); setActiveView("portal"); }}>Couple</button>
          </div>

          <div className="sidebar-section-label">{isOperationsRole ? "Operations" : "My Wedding"}</div>
          {(isOperationsRole ? plannerNav : coupleNav).map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => { setActiveView(item.id); setSelectedCouple(null); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 12, color: "rgba(232,239,230,0.5)", lineHeight: 1.5 }}>
              <div style={{ marginBottom: 10, color: "rgba(232,239,230,0.85)" }}>Signed in as {sessionUser.name}</div>
              <button
                className="btn btn-sm btn-outline"
                style={{ color: "#e8efe6", borderColor: "rgba(232,239,230,0.35)", marginBottom: 10 }}
                onClick={() => {
                  setSessionUser(null);
                  setRole("planner");
                  setActiveView("dashboard");
                  setSelectedCouple(null);
                }}
              >
                Log Out
              </button>
              <div style={{ fontWeight: 600, color: "rgba(232,239,230,0.7)", marginBottom: 2 }}>API: ASP.NET Core</div>
              <div>GET /api/couples</div>
              <div>GET /api/vendors/recommend</div>
              <div>POST /api/timeentries/clock-in</div>
            </div>
          </div>
        </aside>

        <main className="main">
          {renderContent()}
        </main>
      </div>
      )}
    </>
  );
}
