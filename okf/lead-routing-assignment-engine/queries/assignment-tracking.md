---
type: Query Capability
title: "Assign lead to appropriate rep based on territory, account ownership, and cap..."
description: "Assign lead to appropriate rep based on territory, account ownership, and capacity. Create follow-up tasks, notify via Slack, and track assignment-to-contact SLA."
source_id: "assignment-tracking"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Assign lead to appropriate rep based on territory, account ownership, and capacity. Create follow-up tasks, notify via Slack, and track assignment-to-contact SLA.

## Tools used

- [lookup_lead_routing_assignment_engine_playbook](/tools/lookup-lead-routing-assignment-engine-playbook.md)
- [action_salesforce_crm_assign](/tools/action-salesforce-crm-assign.md)

## Runs in

- [assignment_tracking](/workflow/assignment-tracking.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-routing-assignment-engine-end-to-end.md)

# Citations

- [Lead Routing & Assignment Engine Playbook](/documents/lead-routing-assignment-engine-playbook.md)
