---
type: Agent Tool
title: query_kinaxis_rapidresponse_supply_plans
description: Retrieve supply plans from Kinaxis RapidResponse for the Expedite Request Triage Agent workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_kinaxis_rapidresponse_supply_plans

Retrieve supply plans from Kinaxis RapidResponse for the Expedite Request Triage Agent workflow.

- **Kind:** query
- **Source system:** [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)

## Inputs

- plan_number
- date_range

## Outputs

- supply_plans_records
- supply_plans_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [expedite_intake_ticket_triage](/workflow/expedite-intake-ticket-triage.md)
- [requirement_date_reconciliation](/workflow/requirement-date-reconciliation.md)
- [alternate_stock_po_verification](/workflow/alternate-stock-po-verification.md)

## Evals

- [Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/expedite-request-triage-agent-end-to-end.md)
- [ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 431205 by this Friday (2026-07-10), but the Kinaxis RapidResponse supply plan for that material was last revised 40 hours ago and SAP S/4HANA MM shows the PO due_date is already 2026-07-08. Reconcile before you approve anything.](/tests/expedite-request-triage-agent-stale-evidence-reconciliation.md)

## Evidence emitted

- sql_result

## Required inputs

- plan_number
- date_range

## Produces

- supply_plans_records
- supply_plans_summary

# Examples

```
query_kinaxis_rapidresponse_supply_plans(plan_number=<plan_number>, date_range=<date_range>)
```

# Citations

- [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
