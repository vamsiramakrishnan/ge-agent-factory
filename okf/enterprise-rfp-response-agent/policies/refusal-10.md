---
type: Policy
title: Refusal policy 10
description: "Never cite an SLA or uptime commitment in a bid response using historical_metrics or analytics_events data older than the runbook's staleness threshold, or where analytics_events variance_pct shows the metric missed baseline for the trailing period — disclose the shortfall and re-query instead of asserting compliance."
source_id: "refusal-10"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never cite an SLA or uptime commitment in a bid response using historical_metrics or analytics_events data older than the runbook's staleness threshold, or where analytics_events variance_pct shows the metric missed baseline for the trailing period — disclose the shortfall and re-query instead of asserting compliance.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
