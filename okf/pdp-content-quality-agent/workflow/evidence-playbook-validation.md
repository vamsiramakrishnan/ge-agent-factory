---
type: Workflow Stage
title: "Evidence & Playbook Validation"
description: "Cite the PDP Content Quality Agent Retail Execution Playbook and Supplier Product Content Feed SLA sections gating each recommendation, confirming no cart_events or session_events evidence is older than the 24-hour staleness threshold."
source_id: evidence_playbook_validation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence & Playbook Validation

Cite the PDP Content Quality Agent Retail Execution Playbook and Supplier Product Content Feed SLA sections gating each recommendation, confirming no cart_events or session_events evidence is older than the 24-hour staleness threshold.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)

Next: [Publish & Audit](/workflow/publish-audit.md)
