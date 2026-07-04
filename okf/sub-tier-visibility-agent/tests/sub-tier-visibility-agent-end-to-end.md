---
type: Eval Scenario
title: "Run the Sub-Tier Visibility Agent workflow for the current period. Cite the r..."
description: "Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sub-tier-visibility-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sub-tier-data-collection](/queries/sub-tier-data-collection.md)

## Mechanisms to call

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records](/tools/query-cmrt-crt-questionnaires-cmrt-crt-questionnaires-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sub_tier_visibility_agent_policy_guide](/tools/lookup-sub-tier-visibility-agent-policy-guide.md)
- [action_resilinc_log_entry](/tools/action-resilinc-log-entry.md)

## Success rubric

Action log entry executed against Resilinc, with audit-trail entry and Supply Chain Lead notified of outcomes.

# Citations

- [Sub-Tier Visibility Agent Procurement Policy Guide](/documents/sub-tier-visibility-agent-policy-guide.md)
