---
type: Query Capability
title: "Collect pipeline telemetry from Jenkins, GitHub Actions, and ArgoCD — build t..."
description: "Collect pipeline telemetry from Jenkins, GitHub Actions, and ArgoCD — build times, failure rates, deployment frequency, and stage durations across all repositories."
source_id: "telemetry-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect pipeline telemetry from Jenkins, GitHub Actions, and ArgoCD — build times, failure rates, deployment frequency, and stage durations across all repositories.

## Tools used

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_github_actions_pull_requests](/tools/query-github-actions-pull-requests.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

## Runs in

- [telemetry_collection](/workflow/telemetry-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

# Citations

- [CI/CD Pipeline Optimizer Operations Runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
