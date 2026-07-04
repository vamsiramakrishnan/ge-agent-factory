---
type: Query Capability
title: "Gemini reads PO exception context to determine if leakage is capacity-driven ..."
description: "Gemini reads PO exception context to determine if leakage is capacity-driven (supplier could not deliver) or compliance-driven (requester bypassed contract). Generates narrative savings report for CPO linking the gap to demand-driven shortfalls vs. execution gaps with actionable remediation."
source_id: "leakage-interpretation-reporting"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads PO exception context to determine if leakage is capacity-driven (supplier could not deliver) or compliance-driven (requester bypassed contract). Generates narrative savings report for CPO linking the gap to demand-driven shortfalls vs. execution gaps with actionable remediation.

## Tools used

- [lookup_savings_realization_tracker_policy_guide](/tools/lookup-savings-realization-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Runs in

- [leakage_interpretation_reporting](/workflow/leakage-interpretation-reporting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Savings Realization Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/savings-realization-tracker-end-to-end.md)

# Citations

- [Savings Realization Tracker Procurement Policy Guide](/documents/savings-realization-tracker-policy-guide.md)
