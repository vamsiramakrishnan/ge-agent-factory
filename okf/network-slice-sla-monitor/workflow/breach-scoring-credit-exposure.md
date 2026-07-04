---
type: Workflow Stage
title: "Breach Scoring & Credit Exposure"
description: "Score alarm severity, prb_utilization_dl_pct, volte_drop_rate_pct, and cell_availability_pct against the per-slice SLO thresholds in the SLA Credit Schedule, and compute the dollar credit exposure for any breach."
source_id: breach_scoring_credit_exposure
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Breach Scoring & Credit Exposure

Score alarm severity, prb_utilization_dl_pct, volte_drop_rate_pct, and cell_availability_pct against the per-slice SLO thresholds in the SLA Credit Schedule, and compute the dollar credit exposure for any breach.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

Next: [Runbook Evidence Validation](/workflow/runbook-evidence-validation.md)
