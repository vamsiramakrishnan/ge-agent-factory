---
type: Proof Obligation
title: "Golden eval obligation — Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sub-tier-visibility-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sub-tier-visibility-agent-end-to-end](/tests/sub-tier-visibility-agent-end-to-end.md)


## Mechanisms

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records](/tools/query-cmrt-crt-questionnaires-cmrt-crt-questionnaires-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sub_tier_visibility_agent_policy_guide](/tools/lookup-sub-tier-visibility-agent-policy-guide.md)
- [action_resilinc_log_entry](/tools/action-resilinc-log-entry.md)

## Entities that must be referenced

- resilinc_records
- everstream_records
- cmrt_crt_questionnaires_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute log entry without two-system evidence

# Citations

- [sub-tier-visibility-agent-policy-guide](/documents/sub-tier-visibility-agent-policy-guide.md)
