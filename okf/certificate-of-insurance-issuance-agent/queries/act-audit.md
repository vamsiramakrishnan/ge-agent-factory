---
type: Query Capability
title: "Execute the escalate step in Duck Creek Policy with a full audit trail, and e..."
description: "Execute the escalate step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Policy Services Rep."
source_id: "act-audit"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Policy Services Rep.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)

# Citations

- [Certificate of Insurance Issuance Agent Authority & Referral Guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
