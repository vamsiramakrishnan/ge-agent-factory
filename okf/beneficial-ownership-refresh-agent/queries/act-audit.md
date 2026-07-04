---
type: Query Capability
title: "Execute the file step in Fenergo CLM with a full audit trail, and escalate ex..."
description: "Execute the file step in Fenergo CLM with a full audit trail, and escalate exceptions to the KYC Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Fenergo CLM with a full audit trail, and escalate exceptions to the KYC Analyst.

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

- [Run the Beneficial Ownership Refresh Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/beneficial-ownership-refresh-agent-end-to-end.md)

# Citations

- [Beneficial Ownership Refresh Agent Banking Compliance Policy](/documents/beneficial-ownership-refresh-agent-compliance-policy.md)
