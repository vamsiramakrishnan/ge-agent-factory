---
type: Workflow Stage
title: Metric Collection
description: "Aggregate DORA metrics from GitHub (deployment frequency, lead time for changes, change failure rate, MTTR). Pull developer sentiment from Slack channels and survey platforms."
source_id: metric_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Metric Collection

Aggregate DORA metrics from GitHub (deployment frequency, lead time for changes, change failure rate, MTTR). Pull developer sentiment from Slack channels and survey platforms.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_developer_experience_surveyor_runbook](/tools/lookup-developer-experience-surveyor-runbook.md)
- [action_github_deploy](/tools/action-github-deploy.md)

Next: [DORA & Sentiment Scoring](/workflow/dora-sentiment-scoring.md)
