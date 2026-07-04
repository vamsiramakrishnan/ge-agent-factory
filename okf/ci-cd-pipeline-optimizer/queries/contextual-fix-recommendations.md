---
type: Query Capability
title: "Gemini analyzes pipeline failures: 'checkout-service failed 12 times this wee..."
description: "Gemini analyzes pipeline failures: 'checkout-service failed 12 times this week — 8 from the same integration test depending on an external API mock. Recommend extracting mock to shared fixture and adding retry logic.'"
source_id: "contextual-fix-recommendations"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes pipeline failures: 'checkout-service failed 12 times this week — 8 from the same integration test depending on an external API mock. Recommend extracting mock to shared fixture and adding retry logic.'

## Tools used

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
- [lookup_ci_cd_pipeline_optimizer_runbook](/tools/lookup-ci-cd-pipeline-optimizer-runbook.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)

## Runs in

- [contextual_fix_recommendations](/workflow/contextual-fix-recommendations.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

# Citations

- [CI/CD Pipeline Optimizer Operations Runbook](/documents/ci-cd-pipeline-optimizer-runbook.md)
