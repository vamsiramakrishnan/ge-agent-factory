---
type: Query Capability
title: "Offer acceptance in Workday triggers pre-boarding workflow. New hire profile ..."
description: "Offer acceptance in Workday triggers pre-boarding workflow. New hire profile data assembled for cross-functional task orchestration."
source_id: "offer-acceptance-trigger"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Offer acceptance in Workday triggers pre-boarding workflow. New hire profile data assembled for cross-functional task orchestration.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_pre_boarding_orchestration_agent_policy_handbook](/tools/lookup-pre-boarding-orchestration-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Runs in

- [offer_acceptance_trigger](/workflow/offer-acceptance-trigger.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pre-boarding-orchestration-agent-end-to-end.md)

# Citations

- [Pre-boarding Orchestration Agent Policy Handbook](/documents/pre-boarding-orchestration-agent-policy-handbook.md)
