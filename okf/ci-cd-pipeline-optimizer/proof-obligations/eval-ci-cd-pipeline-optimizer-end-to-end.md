---
type: Proof Obligation
title: "Golden eval obligation — Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ci-cd-pipeline-optimizer-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ci-cd-pipeline-optimizer-end-to-end](/tests/ci-cd-pipeline-optimizer-end-to-end.md)


## Mechanisms

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_github_actions_pull_requests](/tools/query-github-actions-pull-requests.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

## Entities that must be referenced

- pipeline_runs
- pull_requests
- pipeline_runs
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [ci-cd-pipeline-optimizer-runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
