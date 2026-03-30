export const ROLES = Object.freeze({
  PLANNER: "planner",
  MANAGER: "manager",
  COUPLE: "couple",
});

export const PRIORITY_LABELS = Object.freeze({
  CRITICAL: "Critical",
  HIGH: "High",
  DO_SOON: "Do soon",
  NORMAL: "Normal",
  WAITING: "Waiting",
});

export const WORKFLOW_STAGES = Object.freeze([
  "Lead Intake",
  "Contract & Deposit",
  "Core Planning",
  "Vendor Selection",
  "Final Prep",
  "Event Week",
  "Completed",
]);

export const VENDOR_STATUSES = Object.freeze([
  "initial_outreach_sent",
  "waiting_for_response",
  "follow_up_needed",
  "responded",
  "meeting_scheduled",
  "quote_received",
  "reviewing",
  "selected",
  "declined",
  "contract_pending",
  "contract_signed",
  "deposit_paid",
]);

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} fullName
 * @property {"planner"|"manager"|"couple"} role
 * @property {string | null} plannerId
 * @property {string | null} coupleId
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} displayName
 * @property {string} eventId
 * @property {string} primaryPlannerId
 * @property {string[]} sharedPlannerIds
 * @property {boolean} contractSigned
 * @property {boolean} depositPaid
 */

/**
 * @typedef {Object} EventRecord
 * @property {string} id
 * @property {string} clientId
 * @property {string} title
 * @property {string} eventDate
 * @property {string} locationCity
 * @property {string} locationState
 * @property {string | null} venueId
 * @property {number} activeStageIndex
 */

/**
 * @typedef {Object} StageRequirement
 * @property {string} key
 * @property {string} label
 * @property {"booleanFlag"|"minAssignedVendorByCategory"|"budgetApproved"|"checklistComplete"} type
 * @property {string=} dependsOnField
 * @property {string=} vendorCategory
 * @property {number=} minCount
 */

/**
 * @typedef {Object} TaskItem
 * @property {string} id
 * @property {string} clientId
 * @property {"Critical"|"High"|"Do soon"|"Normal"|"Waiting"} priority
 * @property {"active"|"blocked"|"waiting"|"done"} state
 * @property {string} title
 * @property {string | null} dueDate
 */

/**
 * @typedef {Object} Vendor
 * @property {string} id
 * @property {string} clientId
 * @property {string} category
 * @property {string} name
 * @property {string} status
 * @property {string | null} lastContactedAt
 * @property {string | null} nextFollowUpAt
 */

/**
 * @typedef {Object} Budget
 * @property {string} id
 * @property {string} clientId
 * @property {number} total
 * @property {number} used
 * @property {boolean} approved
 */

