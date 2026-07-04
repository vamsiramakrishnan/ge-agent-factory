---
type: Workflow Stage
title: Contextual Fix Recommendations
description: "Gemini analyzes pipeline failures: 'checkout-service failed 12 times this week — 8 from the same integration test depending on an external API mock. Recommend extracting mock to shared fixture and adding retry logic.'"
source_id: contextual_fix_recommendations
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual Fix Recommendations

Gemini analyzes pipeline failures: 'checkout-service failed 12 times this week — 8 from the same integration test depending on an external API mock. Recommend extracting mock to shared fixture and adding retry logic.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

Next: [Action & Reporting](/workflow/action-reporting.md)
