---
type: Query Capability
title: Optimal package routed through Workday approval workflow with SLA tracking. O...
description: "Optimal package routed through Workday approval workflow with SLA tracking. Offer letter auto-generated on approval."
source_id: "approval-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimal package routed through Workday approval workflow with SLA tracking. Offer letter auto-generated on approval.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_offer_package_modeler_agent_policy_handbook](/tools/lookup-offer-package-modeler-agent-policy-handbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Runs in

- [approval_generation](/workflow/approval-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offer-package-modeler-agent-end-to-end.md)

# Citations

- [Offer Package Modeler Agent Policy Handbook](/documents/offer-package-modeler-agent-policy-handbook.md)
