---
type: Agent Tool
title: query_banking_3_banking_3_records
description: Retrieve banking 3 records from BANKING 3 for the Advisor Next Best Action Engine workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_banking_3_banking_3_records

Retrieve banking 3 records from BANKING 3 for the Advisor Next Best Action Engine workflow.

- **Kind:** query
- **Source system:** [BANKING 3](/systems/banking-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- banking_3_records_records
- banking_3_records_summary

## Side Effects

- May change BANKING 3 state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_banking_3_banking_3_records](/policies/confirmation-query-banking-3-banking-3-records.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BANKING 3](/systems/banking-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [household_account_context_pull](/workflow/household-account-context-pull.md)
- [evidence_policy_citation_gate](/workflow/evidence-policy-citation-gate.md)
- [task_creation_escalation_audit](/workflow/task-creation-escalation-audit.md)

## Evals

- [Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/advisor-next-best-action-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- banking_3_records_records
- banking_3_records_summary

# Examples

```
query_banking_3_banking_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BANKING 3](/systems/banking-3.md)
- [Confirmation policy — query_banking_3_banking_3_records](/policies/confirmation-query-banking-3-banking-3-records.md)
