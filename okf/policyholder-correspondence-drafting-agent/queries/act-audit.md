---
type: Query Capability
title: "Execute the route step in Duck Creek Policy with a full audit trail, and esca..."
description: "Execute the route step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Customer Service Team Lead."
source_id: "act-audit"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Customer Service Team Lead.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policyholder-correspondence-drafting-agent-end-to-end.md)

# Citations

- [Policyholder Correspondence Drafting Agent Authority & Referral Guide](/documents/policyholder-correspondence-drafting-agent-authority-guide.md)
