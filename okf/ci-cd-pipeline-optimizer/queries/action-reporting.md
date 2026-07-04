---
type: Query Capability
title: "Pipeline health report generated with prioritized fixes. Auto-generated Jira ..."
description: "Pipeline health report generated with prioritized fixes. Auto-generated Jira tickets for recurring issues. Flaky tests auto-quarantined to unblock deployments."
source_id: "action-reporting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline health report generated with prioritized fixes. Auto-generated Jira tickets for recurring issues. Flaky tests auto-quarantined to unblock deployments.

## Tools used

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)

## Runs in

- [action_reporting](/workflow/action-reporting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

# Citations

- [CI/CD Pipeline Optimizer Operations Runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
