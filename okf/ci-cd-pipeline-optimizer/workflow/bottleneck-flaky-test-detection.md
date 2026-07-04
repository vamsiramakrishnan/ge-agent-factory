---
type: Workflow Stage
title: "Bottleneck & Flaky Test Detection"
description: Identify pipeline bottlenecks through build time regression analysis. Detect flaky tests via pass/fail pattern analysis. Score parallelization opportunities by measuring stage dependencies.
source_id: bottleneck_flaky_test_detection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Bottleneck & Flaky Test Detection

Identify pipeline bottlenecks through build time regression analysis. Detect flaky tests via pass/fail pattern analysis. Score parallelization opportunities by measuring stage dependencies.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)

Next: [Contextual Fix Recommendations](/workflow/contextual-fix-recommendations.md)
