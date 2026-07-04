---
type: Eval Scenario
title: Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the re...
description: "Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ci-cd-pipeline-optimizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [telemetry-collection](/queries/telemetry-collection.md)

## Mechanisms to call

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_github_actions_pull_requests](/tools/query-github-actions-pull-requests.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

## Success rubric

Action recommend executed against Jenkins, with audit-trail entry and DevOps Lead notified of outcomes.

# Citations

- [CI/CD Pipeline Optimizer Operations Runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
