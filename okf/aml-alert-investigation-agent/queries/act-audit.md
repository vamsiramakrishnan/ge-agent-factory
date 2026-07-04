---
type: Query Capability
title: "Execute the file step in NICE Actimize with a full audit trail, and escalate ..."
description: "Execute the file step in NICE Actimize with a full audit trail, and escalate exceptions to the AML Investigator."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in NICE Actimize with a full audit trail, and escalate exceptions to the AML Investigator.

## Tools used

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/aml-alert-investigation-agent-end-to-end.md)

# Citations

- [AML Alert Investigation Agent Banking Compliance Policy](/documents/aml-alert-investigation-agent-compliance-policy.md)
