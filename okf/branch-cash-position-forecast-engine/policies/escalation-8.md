---
type: Policy
title: Escalation policy 8
description: "When The BigQuery historical_metrics or cached_aggregates baseline used to size a branch's shipment order is more than 24 hours stale, or analytics_events variance_pct exceeds +/-30% against the seasonal baseline for that branch and period; action: request_more_info; handoff: Regional Cash Logistics Analyst"
source_id: "escalation-8"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| The BigQuery historical_metrics or cached_aggregates baseline used to size a branch's shipment order is more than 24 hours stale, or analytics_events variance_pct exceeds +/-30% against the seasonal baseline for that branch and period | request_more_info | Regional Cash Logistics Analyst | A stale or high-variance baseline cannot reliably distinguish a real cash-out risk from reporting lag, and sizing a shipment on it drives both missed cash-outs and idle vault cash. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
