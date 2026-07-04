---
type: Workflow Stage
title: "Near-net lateral build-cost & interval scoring"
description: "Compare each near-net address against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to estimate lateral build cost, standard vs non-standard construction interval, and recommended access technology (fiber_1gig, fiber_300m, fixed_wireless_access)."
source_id: near_net_lateral_build_cost_interval_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Near-net lateral build-cost & interval scoring

Compare each near-net address against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to estimate lateral build cost, standard vs non-standard construction interval, and recommended access technology (fiber_1gig, fiber_300m, fixed_wireless_access).

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)

Next: [Evidence validation against the Assurance Runbook and Rate Manual](/workflow/evidence-validation-against-the-assurance-runbook-and-rate-manual.md)
