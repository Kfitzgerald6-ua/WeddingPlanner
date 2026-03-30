import { PRIORITY_LABELS, ROLES } from "../domain/models";

export const seedUsers = [
  { id: "u-planner-1", fullName: "Rachel Torres", role: ROLES.PLANNER, plannerId: "u-planner-1", coupleId: null },
  { id: "u-manager-1", fullName: "Morgan Davis", role: ROLES.MANAGER, plannerId: null, coupleId: null },
  { id: "u-couple-1", fullName: "Emma Thompson", role: ROLES.COUPLE, plannerId: null, coupleId: "client-1" },
];

export const seedClients = [
  {
    id: "client-1",
    displayName: "Emma Thompson & Liam Nguyen",
    eventId: "event-1",
    primaryPlannerId: "u-planner-1",
    sharedPlannerIds: [],
    contractSigned: true,
    depositPaid: true,
  },
  {
    id: "client-2",
    displayName: "Sophia Martinez & Alex Johnson",
    eventId: "event-2",
    primaryPlannerId: "u-planner-1",
    sharedPlannerIds: [],
    contractSigned: false,
    depositPaid: false,
  },
];

export const seedEvents = [
  {
    id: "event-1",
    clientId: "client-1",
    title: "Wedding Day",
    eventDate: "2026-06-14",
    locationCity: "Tuscaloosa",
    locationState: "AL",
    venueId: "venue-1",
    activeStageIndex: 3,
  },
  {
    id: "event-2",
    clientId: "client-2",
    title: "Wedding Day",
    eventDate: "2026-09-20",
    locationCity: "Birmingham",
    locationState: "AL",
    venueId: null,
    activeStageIndex: 1,
  },
];

export const seedVenues = [
  {
    id: "venue-1",
    name: "Tuscaloosa Grand Ballroom",
    city: "Tuscaloosa",
    state: "AL",
    capacity: 320,
    contactName: "James Porter",
    notes: "Strong indoor rain backup and large prep suite.",
  },
  {
    id: "venue-2",
    name: "Oakridge Garden Estate",
    city: "Birmingham",
    state: "AL",
    capacity: 200,
    contactName: "Nia Graham",
    notes: "Popular spring dates; outdoor layout options available.",
  },
];

export const seedVendors = [
  {
    id: "vendor-1",
    clientId: "client-1",
    category: "Florist",
    name: "Magnolia Blooms",
    status: "quote_received",
    lastContactedAt: "2026-03-24T10:00:00Z",
    nextFollowUpAt: "2026-03-31T10:00:00Z",
  },
  {
    id: "vendor-2",
    clientId: "client-1",
    category: "Photography",
    name: "Golden Hour Photography",
    status: "contract_signed",
    lastContactedAt: "2026-03-25T15:00:00Z",
    nextFollowUpAt: null,
  },
  {
    id: "vendor-3",
    clientId: "client-2",
    category: "Florist",
    name: "Petal Theory Studio",
    status: "waiting_for_response",
    lastContactedAt: "2026-03-20T09:00:00Z",
    nextFollowUpAt: "2026-03-27T09:00:00Z",
  },
];

export const seedBudgets = [
  { id: "budget-1", clientId: "client-1", total: 45000, used: 31200, approved: true },
  { id: "budget-2", clientId: "client-2", total: 65000, used: 21800, approved: false },
];

export const seedTasks = [
  {
    id: "task-1",
    clientId: "client-2",
    priority: PRIORITY_LABELS.CRITICAL,
    state: "blocked",
    title: "Contract not signed; cannot move to active planning",
    dueDate: "2026-04-01",
  },
  {
    id: "task-2",
    clientId: "client-2",
    priority: PRIORITY_LABELS.HIGH,
    state: "active",
    title: "Follow up with florist quote requests",
    dueDate: "2026-04-02",
  },
  {
    id: "task-3",
    clientId: "client-1",
    priority: PRIORITY_LABELS.DO_SOON,
    state: "waiting",
    title: "Venue deposit still pending confirmation",
    dueDate: "2026-04-04",
  },
];

export const seedChecklistItems = [
  { id: "check-1", clientId: "client-1", label: "Finalize guest list", isCritical: true, completed: false },
  { id: "check-2", clientId: "client-1", label: "Review floral mockups", isCritical: false, completed: false },
  { id: "check-3", clientId: "client-2", label: "Sign planning contract", isCritical: true, completed: false },
];

export const seedTimeEntries = [
  {
    id: "time-1",
    clientId: "client-1",
    employeeUserId: "u-planner-1",
    hours: 2.5,
    category: "Vendor Meeting",
    isBillable: true,
  },
  {
    id: "time-2",
    clientId: "client-1",
    employeeUserId: "u-manager-1",
    hours: 1.25,
    category: "Admin Review",
    isBillable: false,
  },
];

export const seedMessageThreads = [
  {
    id: "thread-1",
    clientId: "client-1",
    participants: ["u-planner-1", "u-couple-1"],
    messages: [
      { id: "msg-1", senderUserId: "u-couple-1", body: "Can we compare florist quotes this week?", sentAt: "2026-03-29T08:30:00Z" },
      { id: "msg-2", senderUserId: "u-planner-1", body: "Yes, I will send options by tomorrow.", sentAt: "2026-03-29T09:00:00Z" },
    ],
  },
];

export const seedVendorRecommendations = [
  {
    id: "rec-1",
    serviceType: "Florist",
    location: "Tuscaloosa, AL",
    vendorName: "Magnolia Blooms",
    reason: "High response quality and strong budget fit.",
    source: "mock",
  },
];

export const seedAgentRecommendations = [
  {
    id: "agent-1",
    clientId: "client-2",
    title: "Contract not signed, cannot move to planning stage",
    recommendationType: "blocker",
  },
  {
    id: "agent-2",
    clientId: "client-2",
    title: "No response from florist in 5 days - send follow-up",
    recommendationType: "follow_up",
  },
];

