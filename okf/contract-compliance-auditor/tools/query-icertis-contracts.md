---
type: Agent Tool
title: query_icertis_contracts
description: "Retrieve contract master records including term start/end dates, vendor IDs, and status."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_icertis_contracts

Retrieve contract master records including term start/end dates, vendor IDs, and status.

- **Kind:** query
- **Source system:** [Icertis](/systems/icertis.md)

## Inputs

- contract_id

## Outputs

- contract_record
- vendor_id
- effective_date
- term_months

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Icertis](/systems/icertis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)

## Evidence emitted

- source_system_record

## Required inputs

- contract_id

## Produces

- contract_record
- vendor_id
- effective_date
- term_months

# Examples

```
query_icertis_contracts(contract_id=<contract_id>)
```

# Citations

- [Icertis](/systems/icertis.md)
