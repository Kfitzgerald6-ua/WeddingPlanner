import { WORKFLOW_STAGES } from "./models";

export const STAGE_REQUIREMENTS = Object.freeze({
  "Contract & Deposit": [
    {
      key: "contract_signed",
      label: "Contract must be signed",
      type: "booleanFlag",
      dependsOnField: "contractSigned",
    },
    {
      key: "deposit_paid",
      label: "Initial deposit must be paid",
      type: "booleanFlag",
      dependsOnField: "depositPaid",
    },
  ],
  "Vendor Selection": [
    {
      key: "venue_selected",
      label: "A venue must be selected",
      type: "booleanFlag",
      dependsOnField: "hasVenue",
    },
    {
      key: "florist_assigned",
      label: "At least 1 florist must be assigned",
      type: "minAssignedVendorByCategory",
      vendorCategory: "Florist",
      minCount: 1,
    },
  ],
  "Final Prep": [
    {
      key: "budget_approved",
      label: "Budget must be approved",
      type: "budgetApproved",
    },
    {
      key: "critical_checklist_complete",
      label: "Critical checklist items must be complete",
      type: "checklistComplete",
    },
  ],
});

function evaluateRequirement(requirement, context) {
  if (requirement.type === "booleanFlag") {
    return Boolean(context.client?.[requirement.dependsOnField]);
  }

  if (requirement.type === "minAssignedVendorByCategory") {
    const count = context.assignedVendors.filter(
      (vendor) => vendor.category === requirement.vendorCategory,
    ).length;
    return count >= (requirement.minCount ?? 1);
  }

  if (requirement.type === "budgetApproved") {
    return Boolean(context.budget?.approved);
  }

  if (requirement.type === "checklistComplete") {
    const criticalItems = context.checklist.filter((item) => item.isCritical);
    return criticalItems.every((item) => item.completed);
  }

  return true;
}

export function getStageRequirements(stageName) {
  return STAGE_REQUIREMENTS[stageName] ?? [];
}

export function canAdvanceToStage(stageName, context) {
  const requirements = getStageRequirements(stageName);
  const failedRequirements = requirements.filter(
    (requirement) => !evaluateRequirement(requirement, context),
  );

  return {
    allowed: failedRequirements.length === 0,
    failedRequirements,
  };
}

export function canAdvanceStageByIndex(targetStageIndex, context) {
  const stageName = WORKFLOW_STAGES[targetStageIndex];

  if (!stageName) {
    return {
      allowed: false,
      failedRequirements: [{ key: "invalid_stage", label: "Target stage is invalid" }],
    };
  }

  // TODO: Move this engine server-side and use the same checks in API mutations.
  return canAdvanceToStage(stageName, context);
}

