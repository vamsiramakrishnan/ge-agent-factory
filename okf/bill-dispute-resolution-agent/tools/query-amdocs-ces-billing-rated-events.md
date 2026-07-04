---
type: Agent Tool
title: query_amdocs_ces_billing_rated_events
description: Retrieve rated events from Amdocs CES Billing for the Bill Dispute Resolution Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_amdocs_ces_billing_rated_events

Retrieve rated events from Amdocs CES Billing for the Bill Dispute Resolution Agent workflow.

- **Kind:** query
- **Source system:** [Amdocs CES Billing](/systems/amdocs-ces-billing.md)

## Inputs

- event_id
- subscriber_key
- date_range

## Outputs

- rated_events_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Amdocs CES Billing](/systems/amdocs-ces-billing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- event_id
- subscriber_key
- date_range

## Produces

- rated_events_records

# Examples

```
query_amdocs_ces_billing_rated_events(event_id=<event_id>, subscriber_key=<subscriber_key>, date_range=<date_range>)
```

# Citations

- [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
