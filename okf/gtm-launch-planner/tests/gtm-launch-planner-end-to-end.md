---
type: Eval Scenario
title: Run the GTM Launch Planner workflow for the current period. Cite the relevant...
description: "Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "gtm-launch-planner-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [orchestration-setup](/queries/orchestration-setup.md)

## Mechanisms to call

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_gtm_launch_planner_playbook](/tools/lookup-gtm-launch-planner-playbook.md)
- [action_asana_generate](/tools/action-asana-generate.md)

## Success rubric

Action generate executed against Asana, with audit-trail entry and VP Marketing notified of outcomes.

# Citations

- [GTM Launch Planner Playbook](/documents/gtm-launch-planner-playbook.md)
