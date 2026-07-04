---
type: Workflow Stage
title: Telemetry Collection
description: "Collect pipeline telemetry from Jenkins, GitHub Actions, and ArgoCD — build times, failure rates, deployment frequency, and stage durations across all repositories."
source_id: telemetry_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Telemetry Collection

Collect pipeline telemetry from Jenkins, GitHub Actions, and ArgoCD — build times, failure rates, deployment frequency, and stage durations across all repositories.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_github_actions_pull_requests](/tools/query-github-actions-pull-requests.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

Next: [Bottleneck & Flaky Test Detection](/workflow/bottleneck-flaky-test-detection.md)
