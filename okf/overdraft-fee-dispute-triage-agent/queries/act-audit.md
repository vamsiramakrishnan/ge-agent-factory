---
type: Query Capability
title: "Execute the escalate step in Temenos Transact with a full audit trail, and es..."
description: "Execute the escalate step in Temenos Transact with a full audit trail, and escalate exceptions to the Retail Banking Service Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Temenos Transact with a full audit trail, and escalate exceptions to the Retail Banking Service Manager.

## Tools used

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Overdraft Fee Dispute Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/overdraft-fee-dispute-triage-agent-end-to-end.md)

# Citations

- [Overdraft Fee Dispute Triage Agent Banking Compliance Policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
