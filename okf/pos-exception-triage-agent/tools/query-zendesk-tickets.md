---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the POS Exception Triage Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_zendesk_tickets

Retrieve tickets from Zendesk for the POS Exception Triage Agent workflow.

- **Kind:** query
- **Source system:** [Zendesk](/systems/zendesk.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Zendesk](/systems/zendesk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ticket_correlation_dedup](/workflow/ticket-correlation-dedup.md)

## Evals

- [Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pos-exception-triage-agent-end-to-end.md)
- [Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift.](/tests/pos-exception-triage-agent-emv-floor-limit-edge.md)
- [Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on.](/tests/pos-exception-triage-agent-repeat-register-stale-baseline.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_zendesk_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Zendesk](/systems/zendesk.md)
