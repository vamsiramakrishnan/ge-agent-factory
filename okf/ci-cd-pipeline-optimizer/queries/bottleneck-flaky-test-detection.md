---
type: Query Capability
title: Identify pipeline bottlenecks through build time regression analysis. Detect ...
description: Identify pipeline bottlenecks through build time regression analysis. Detect flaky tests via pass/fail pattern analysis. Score parallelization opportunities by measuring stage dependencies.
source_id: "bottleneck-flaky-test-detection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify pipeline bottlenecks through build time regression analysis. Detect flaky tests via pass/fail pattern analysis. Score parallelization opportunities by measuring stage dependencies.

## Tools used

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)

## Runs in

- [bottleneck_flaky_test_detection](/workflow/bottleneck-flaky-test-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

# Citations

- [CI/CD Pipeline Optimizer Operations Runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
