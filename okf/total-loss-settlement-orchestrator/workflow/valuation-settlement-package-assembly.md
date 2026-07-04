---
type: Workflow Stage
title: "Valuation & Settlement Package Assembly"
description: "Pull historical_metrics and cached_aggregates from BigQuery to benchmark the actual cash value against comparable settlements, and cite the Total Loss Settlement Orchestrator Authority & Referral Guide and the Total Loss Valuation & Salvage Disposition Work Instruction before finalizing the offer."
source_id: valuation_settlement_package_assembly
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Valuation & Settlement Package Assembly

Pull historical_metrics and cached_aggregates from BigQuery to benchmark the actual cash value against comparable settlements, and cite the Total Loss Settlement Orchestrator Authority & Referral Guide and the Total Loss Valuation & Salvage Disposition Work Instruction before finalizing the offer.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)

Next: [E-Signature Dispatch & Milestone Tracking](/workflow/e-signature-dispatch-milestone-tracking.md)
