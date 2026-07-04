---
type: Proof Obligation
title: "Golden eval obligation — Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-code-review-assistant-end-to-end"
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

# Golden eval obligation — Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [code-review-assistant-end-to-end](/tests/code-review-assistant-end-to-end.md)


## Mechanisms

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gitlab_merge_requests](/tools/query-gitlab-merge-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

## Entities that must be referenced

- pull_requests
- merge_requests
- code_smells

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [code-review-assistant-runbook](/documents/code-review-assistant-runbook.md)
