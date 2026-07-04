---
type: Query Capability
title: "Create project plan in Asana, assign tasks across functions, set up HubSpot c..."
description: "Create project plan in Asana, assign tasks across functions, set up HubSpot campaign, and schedule Slack notifications at key milestones."
source_id: "orchestration-setup"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create project plan in Asana, assign tasks across functions, set up HubSpot campaign, and schedule Slack notifications at key milestones.

## Tools used

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_gtm_launch_planner_playbook](/tools/lookup-gtm-launch-planner-playbook.md)
- [action_asana_generate](/tools/action-asana-generate.md)

## Runs in

- [orchestration_setup](/workflow/orchestration-setup.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gtm-launch-planner-end-to-end.md)

# Citations

- [GTM Launch Planner Playbook](/documents/gtm-launch-planner-playbook.md)
