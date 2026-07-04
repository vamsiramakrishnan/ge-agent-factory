---
type: Agent Tool
title: query_kyriba_cash_positions
description: Retrieve cash positions from Kyriba for the Investment Portfolio Optimizer workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_kyriba_cash_positions

Retrieve cash positions from Kyriba for the Investment Portfolio Optimizer workflow.

- **Kind:** query
- **Source system:** [Kyriba](/systems/kyriba.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cash_positions_records
- cash_positions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kyriba](/systems/kyriba.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [portfolio_market_data](/workflow/portfolio-market-data.md)
- [portfolio_optimization](/workflow/portfolio-optimization.md)

## Evals

- [Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investment-portfolio-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cash_positions_records
- cash_positions_summary

# Examples

```
query_kyriba_cash_positions(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Kyriba](/systems/kyriba.md)
