---
type: Workflow Stage
title: "Registry & FinCEN BOI Cross-Check"
description: "Compare entity_profiles.fincen_boi_verified and beneficial_owner_count against corporate registry data and BigQuery historical_metrics baselines to isolate entities with genuine ownership changes from no-change rollovers."
source_id: registry_fin_cen_boi_cross_check
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Registry & FinCEN BOI Cross-Check

Compare entity_profiles.fincen_boi_verified and beneficial_owner_count against corporate registry data and BigQuery historical_metrics baselines to isolate entities with genuine ownership changes from no-change rollovers.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Targeted Certification Outreach](/workflow/targeted-certification-outreach.md)
