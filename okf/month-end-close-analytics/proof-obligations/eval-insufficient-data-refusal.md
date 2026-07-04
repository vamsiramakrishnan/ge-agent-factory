---
type: Proof Obligation
title: Golden eval obligation — Show me the close cycle trend for the last 2 years.
description: golden eval proof obligation
source_id: "eval-insufficient-data-refusal"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Show me the close cycle trend for the last 2 years.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [insufficient-data-refusal](/tests/insufficient-data-refusal.md)


## Mechanisms

- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)

## Forbidden behaviors

- do not extrapolate or invent cycle time data beyond the available history
