---
type: Agent Tool
title: query_murex_mx_3_trades
description: Retrieve trades from Murex MX.3 for the Intraday Liquidity Forecasting Engine workflow.
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

# query_murex_mx_3_trades

Retrieve trades from Murex MX.3 for the Intraday Liquidity Forecasting Engine workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- trade_id
- cusip
- date_range

## Outputs

- trades_records
- trades_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Intraday Liquidity Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intraday-liquidity-forecasting-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- trade_id
- cusip
- date_range

## Produces

- trades_records
- trades_summary

# Examples

```
query_murex_mx_3_trades(trade_id=<trade_id>, cusip=<cusip>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
