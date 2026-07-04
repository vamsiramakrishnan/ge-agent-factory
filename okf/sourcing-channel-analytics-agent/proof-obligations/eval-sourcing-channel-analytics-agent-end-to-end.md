---
type: Proof Obligation
title: "Golden eval obligation — Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sourcing-channel-analytics-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sourcing-channel-analytics-agent-end-to-end](/tests/sourcing-channel-analytics-agent-end-to-end.md)


## Mechanisms

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_sourcing_channel_analytics_agent_policy_handbook](/tools/lookup-sourcing-channel-analytics-agent-policy-handbook.md)
- [action_ats_recommend](/tools/action-ats-recommend.md)

## Entities that must be referenced

- ats_records
- linkedin_records
- indeed_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [sourcing-channel-analytics-agent-policy-handbook](/documents/sourcing-channel-analytics-agent-policy-handbook.md)
