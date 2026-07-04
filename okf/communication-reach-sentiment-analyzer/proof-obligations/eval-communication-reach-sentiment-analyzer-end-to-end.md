---
type: Proof Obligation
title: "Golden eval obligation — Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-communication-reach-sentiment-analyzer-end-to-end"
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

# Golden eval obligation — Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [communication-reach-sentiment-analyzer-end-to-end](/tests/communication-reach-sentiment-analyzer-end-to-end.md)


## Mechanisms

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_communication_reach_sentiment_analyzer_policy_handbook](/tools/lookup-communication-reach-sentiment-analyzer-policy-handbook.md)
- [action_slack_recommend](/tools/action-slack-recommend.md)

## Entities that must be referenced

- messages
- messages
- intranet_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [communication-reach-sentiment-analyzer-policy-handbook](/documents/communication-reach-sentiment-analyzer-policy-handbook.md)
