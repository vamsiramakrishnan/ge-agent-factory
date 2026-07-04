---
type: Workflow Stage
title: "Gap Scoring & Queue Prioritization"
description: "Rank flagged claims into the Claims Operations Manager's daily queue using Looker dashboards and metric_definitions, ordered by adverse-development dollars, claim_status, and time since the last reserve_lines transaction."
source_id: gap_scoring_queue_prioritization
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Gap Scoring & Queue Prioritization

Rank flagged claims into the Claims Operations Manager's daily queue using Looker dashboards and metric_definitions, ordered by adverse-development dollars, claim_status, and time since the last reserve_lines transaction.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)

Next: [Manager Escalation & File Action](/workflow/manager-escalation-file-action.md)
