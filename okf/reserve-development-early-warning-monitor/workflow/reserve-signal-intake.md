---
type: Workflow Stage
title: Reserve Signal Intake
description: "Screen claims, claim_exposures, and reserve_lines in Guidewire ClaimCenter for new medical bills, attorney correspondence, and status changes (attorney_represented flips, demand_amount postings, pending_coverage_determination shifts) that could move expected ultimate cost."
source_id: reserve_signal_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reserve Signal Intake

Screen claims, claim_exposures, and reserve_lines in Guidewire ClaimCenter for new medical bills, attorney correspondence, and status changes (attorney_represented flips, demand_amount postings, pending_coverage_determination shifts) that could move expected ultimate cost.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

Next: [Severity Benchmarking](/workflow/severity-benchmarking.md)
