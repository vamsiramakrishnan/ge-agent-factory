---
type: Eval Scenario
title: "Run the Communication Reach & Sentiment Analyzer workflow for the current per..."
description: "Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "communication-reach-sentiment-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [engagement-data-collection](/queries/engagement-data-collection.md)

## Mechanisms to call

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_communication_reach_sentiment_analyzer_policy_handbook](/tools/lookup-communication-reach-sentiment-analyzer-policy-handbook.md)
- [action_slack_recommend](/tools/action-slack-recommend.md)

## Success rubric

Action recommend executed against Slack, with audit-trail entry and Internal Comms notified of outcomes.

# Citations

- [Communication Reach & Sentiment Analyzer Policy Handbook](/documents/communication-reach-sentiment-analyzer-policy-handbook.md)
