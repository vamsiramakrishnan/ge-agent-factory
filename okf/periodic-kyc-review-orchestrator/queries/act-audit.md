---
type: Query Capability
title: "Execute the file step in Fenergo CLM with a full audit trail, and escalate ex..."
description: "Execute the file step in Fenergo CLM with a full audit trail, and escalate exceptions to the KYC Operations Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Fenergo CLM with a full audit trail, and escalate exceptions to the KYC Operations Manager.

## Tools used

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Periodic KYC Review Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/periodic-kyc-review-orchestrator-end-to-end.md)

# Citations

- [Periodic KYC Review Orchestrator Banking Compliance Policy](/documents/periodic-kyc-review-orchestrator-compliance-policy.md)
