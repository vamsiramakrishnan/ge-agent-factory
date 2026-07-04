---
type: Workflow Stage
title: "Sub-Tier Data Collection"
description: "Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, and ingest Resilinc/Everstream sub-tier supplier data. Parse responses for sub-tier entity names, locations, and material flows."
source_id: sub_tier_data_collection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sub-Tier Data Collection

Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, and ingest Resilinc/Everstream sub-tier supplier data. Parse responses for sub-tier entity names, locations, and material flows.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records](/tools/query-cmrt-crt-questionnaires-cmrt-crt-questionnaires-records.md)
- [lookup_sub_tier_visibility_agent_policy_guide](/tools/lookup-sub-tier-visibility-agent-policy-guide.md)
- [action_resilinc_log_entry](/tools/action-resilinc-log-entry.md)

Next: [Graph Analytics & Risk Propagation](/workflow/graph-analytics-risk-propagation.md)
