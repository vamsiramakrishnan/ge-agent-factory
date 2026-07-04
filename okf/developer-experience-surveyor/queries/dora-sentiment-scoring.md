---
type: Query Capability
title: "Calculate DORA metrics with team-level breakdowns. Score developer productivi..."
description: "Calculate DORA metrics with team-level breakdowns. Score developer productivity and satisfaction. Identify tooling friction points from Slack sentiment analysis."
source_id: "dora-sentiment-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate DORA metrics with team-level breakdowns. Score developer productivity and satisfaction. Identify tooling friction points from Slack sentiment analysis.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_developer_experience_surveyor_runbook](/tools/lookup-developer-experience-surveyor-runbook.md)

## Runs in

- [dora_sentiment_scoring](/workflow/dora-sentiment-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/developer-experience-surveyor-end-to-end.md)

# Citations

- [Developer Experience Surveyor Operations Runbook](/documents/developer-experience-surveyor-runbook.md)
