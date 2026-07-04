---
type: Query Capability
title: "Execute the publish step in FIS Payments Hub with a full audit trail, and esc..."
description: "Execute the publish step in FIS Payments Hub with a full audit trail, and escalate exceptions to the ACH Operations Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in FIS Payments Hub with a full audit trail, and escalate exceptions to the ACH Operations Analyst.

## Tools used

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ach-return-root-cause-analyzer-end-to-end.md)

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
