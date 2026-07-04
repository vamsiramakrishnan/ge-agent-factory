---
type: Query Capability
title: "Execute the recommend step in nCino Loan Origination with a full audit trail,..."
description: "Execute the recommend step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor.

## Tools used

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-delinquency-outreach-orchestrator-end-to-end.md)

# Citations

- [Early Delinquency Outreach Orchestrator Banking Compliance Policy](/documents/early-delinquency-outreach-orchestrator-compliance-policy.md)
