import { ROLES } from "../domain/models";

export const APP_ROUTES = Object.freeze({
  plannerDashboard: { path: "/planner/dashboard", label: "Dashboard", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  clientsWorkingView: { path: "/planner/working-view", label: "Clients Working View", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  clientsList: { path: "/planner/clients", label: "Clients", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  clientDetail: { path: "/planner/clients/:clientId", label: "Client Detail", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  vendors: { path: "/planner/vendors", label: "Vendors", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  tasksQueue: { path: "/planner/tasks", label: "Tasks / Queue", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  budgetHours: { path: "/planner/budget-hours", label: "Budget / Hours", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  plannerMessages: { path: "/planner/messages", label: "Messages", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  venues: { path: "/planner/venues", label: "Venues", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  aiLayoutSamples: { path: "/planner/ai-layout-samples", label: "AI Layout Samples", roles: [ROLES.PLANNER, ROLES.MANAGER] },
  coupleDashboard: { path: "/couple/dashboard", label: "Dashboard", roles: [ROLES.COUPLE] },
  coupleChecklist: { path: "/couple/checklist", label: "Checklist", roles: [ROLES.COUPLE] },
  coupleBudget: { path: "/couple/budget", label: "Budget", roles: [ROLES.COUPLE] },
  coupleVendors: { path: "/couple/vendors", label: "Vendors", roles: [ROLES.COUPLE] },
  coupleVenue: { path: "/couple/venue", label: "Venue", roles: [ROLES.COUPLE] },
  coupleMessages: { path: "/couple/messages", label: "Messages", roles: [ROLES.COUPLE] },
});

export function getRoutesForRole(role) {
  return Object.values(APP_ROUTES).filter((route) => route.roles.includes(role));
}

