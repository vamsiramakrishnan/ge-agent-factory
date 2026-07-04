---
type: Query Capability
title: "Aggregate multi-channel engagement signals — opens, clicks, reactions, replie..."
description: "Aggregate multi-channel engagement signals — opens, clicks, reactions, replies, and thread depth from Slack and email. Join with Workday segments for demographic analysis."
source_id: "engagement-data-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate multi-channel engagement signals — opens, clicks, reactions, replies, and thread depth from Slack and email. Join with Workday segments for demographic analysis.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [action_slack_recommend](/tools/action-slack-recommend.md)

## Runs in

- [engagement_data_collection](/workflow/engagement-data-collection.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/communication-reach-sentiment-analyzer-end-to-end.md)

# Citations

- [Communication Reach & Sentiment Analyzer Policy Handbook](/documents/communication-reach-sentiment-analyzer-policy-handbook.md)
