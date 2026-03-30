# Wedding Planner MVP - Phase 1

This phase defines architecture and core product contracts without rewriting the whole UI.

## What Is Built Now

- Folder structure and domain boundaries for future incremental phases.
- Core data contracts for roles, clients, events, tasks, vendors, budgets, messages, and venues.
- Route map for planner/manager and couple experiences.
- Role and permission model functions for UI and logic checks.
- Stage requirement engine scaffold with gate validation and blocker reporting.
- Centralized mock seed data that can be replaced by API calls later.

## Build Later (Future Phases)

- Full route/page migration from single-file app to modular screens.
- Advanced prioritization scoring and waiting-state automation.
- Backend-enforced stage requirements and shared rule engine.
- AI vendor recommendation API integration.
- AI venue layout image generation integration.

## Proposed Frontend Structure

```text
frontend/src/
  app/
    routes.js
  components/
    layout/
    common/
    dashboard/
    clients/
    vendors/
    messaging/
    venues/
  data/
    mockSeed.js
  domain/
    models.js
    permissions.js
    stageRequirements.js
  features/
    dashboard/
    clientsWorkingView/
    clientDetail/
    vendors/
    couplePortal/
    tasksQueue/
    budgetHours/
    messages/
    venues/
  services/
    apiClient.js
    recommendationService.js
  utils/
```

## Route/Page Structure

Planner/Manager:
- `/planner/dashboard`
- `/planner/working-view`
- `/planner/clients`
- `/planner/clients/:clientId`
- `/planner/vendors`
- `/planner/tasks`
- `/planner/budget-hours`
- `/planner/messages`
- `/planner/venues`
- `/planner/ai-layout-samples`

Couple:
- `/couple/dashboard`
- `/couple/checklist`
- `/couple/budget`
- `/couple/vendors`
- `/couple/venue`
- `/couple/messages`

## Reusable UI Components (Planned)

- App shell and role-aware navigation.
- Stat cards, status badges, urgency chips, timeline chips.
- Progress stepper and stage blocker alert.
- Budget bar and financial summary cards.
- Task queue list/table with active/blocked/waiting states.
- Message thread and composer.
- Empty/loading state components.

## Permission Model

Roles:
- Planner
- Manager/Admin
- Couple

Core constraints:
- Couples only access their own event data.
- Couples are read-only except messaging.
- Only manager/admin can view full internal timelog set.
- Planners only see timelogs they are allowed to view.
- Permission checks are used in rendering and logic functions.

## Stage Requirement Engine Structure

`domain/stageRequirements.js` provides:
- Stage-to-requirements mapping.
- Requirement type handlers:
  - boolean flag checks
  - minimum vendor assignment by category
  - budget approval checks
  - critical checklist completion checks
- Gate result shape:
  - `allowed`
  - `failedRequirements`

This supports workflow rules like:
- Contract must be signed before active planning.
- Florist-dependent stages require at least one florist assignment.
- Stage advancement blocks with explicit missing requirements.

