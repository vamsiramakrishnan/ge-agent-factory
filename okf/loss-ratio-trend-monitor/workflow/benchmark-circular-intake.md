---
type: Workflow Stage
title: "Benchmark & Circular Intake"
description: "Pull loss_cost_benchmarks, circular_updates, and territory_factors from Verisk ISO ERC via query_verisk_iso_erc_loss_cost_benchmarks so every state/class/tier cell is scored against a current rating basis, not a stale one."
source_id: benchmark_circular_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Benchmark & Circular Intake

Pull loss_cost_benchmarks, circular_updates, and territory_factors from Verisk ISO ERC via query_verisk_iso_erc_loss_cost_benchmarks so every state/class/tier cell is scored against a current rating basis, not a stale one.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)
- [action_verisk_iso_erc_escalate](/tools/action-verisk-iso-erc-escalate.md)

Next: [Segment Loss Ratio Decomposition](/workflow/segment-loss-ratio-decomposition.md)
