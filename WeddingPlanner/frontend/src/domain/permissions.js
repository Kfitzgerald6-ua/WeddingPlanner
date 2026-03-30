import { ROLES } from "./models";

export const PERMISSIONS = Object.freeze({
  VIEW_PLANNER_DASHBOARD: "view_planner_dashboard",
  VIEW_WORKING_QUEUE: "view_working_queue",
  VIEW_CLIENT: "view_client",
  EDIT_CLIENT_WORKFLOW: "edit_client_workflow",
  VIEW_VENDOR_CENTER: "view_vendor_center",
  EDIT_VENDOR_CENTER: "edit_vendor_center",
  VIEW_BUDGET: "view_budget",
  VIEW_INTERNAL_TIME_LOGS: "view_internal_time_logs",
  VIEW_ALL_TIME_LOGS: "view_all_time_logs",
  VIEW_COUPLE_PORTAL: "view_couple_portal",
  SEND_MESSAGE: "send_message",
});

const rolePermissionMap = {
  [ROLES.PLANNER]: new Set([
    PERMISSIONS.VIEW_PLANNER_DASHBOARD,
    PERMISSIONS.VIEW_WORKING_QUEUE,
    PERMISSIONS.VIEW_CLIENT,
    PERMISSIONS.EDIT_CLIENT_WORKFLOW,
    PERMISSIONS.VIEW_VENDOR_CENTER,
    PERMISSIONS.EDIT_VENDOR_CENTER,
    PERMISSIONS.VIEW_BUDGET,
    PERMISSIONS.VIEW_INTERNAL_TIME_LOGS,
    PERMISSIONS.SEND_MESSAGE,
  ]),
  [ROLES.MANAGER]: new Set([
    PERMISSIONS.VIEW_PLANNER_DASHBOARD,
    PERMISSIONS.VIEW_WORKING_QUEUE,
    PERMISSIONS.VIEW_CLIENT,
    PERMISSIONS.EDIT_CLIENT_WORKFLOW,
    PERMISSIONS.VIEW_VENDOR_CENTER,
    PERMISSIONS.EDIT_VENDOR_CENTER,
    PERMISSIONS.VIEW_BUDGET,
    PERMISSIONS.VIEW_INTERNAL_TIME_LOGS,
    PERMISSIONS.VIEW_ALL_TIME_LOGS,
    PERMISSIONS.SEND_MESSAGE,
  ]),
  [ROLES.COUPLE]: new Set([
    PERMISSIONS.VIEW_COUPLE_PORTAL,
    PERMISSIONS.VIEW_BUDGET,
    PERMISSIONS.SEND_MESSAGE,
  ]),
};

export function hasPermission(user, permission) {
  return Boolean(rolePermissionMap[user.role]?.has(permission));
}

export function canViewClient(user, client) {
  if (!hasPermission(user, PERMISSIONS.VIEW_CLIENT)) {
    return user.role === ROLES.COUPLE && user.coupleId === client.id;
  }

  if (user.role === ROLES.PLANNER) {
    return (
      client.primaryPlannerId === user.id || client.sharedPlannerIds.includes(user.id)
    );
  }

  return true;
}

export function canViewTimeEntry(user, timeEntry) {
  if (hasPermission(user, PERMISSIONS.VIEW_ALL_TIME_LOGS)) {
    return true;
  }

  if (user.role === ROLES.PLANNER) {
    return timeEntry.employeeUserId === user.id;
  }

  return false;
}

