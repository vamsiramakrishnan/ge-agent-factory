---
type: Query Capability
title: "Auto-generated PRs to remove stale flag references from codebase. Each PR inc..."
description: "Auto-generated PRs to remove stale flag references from codebase. Each PR includes impact analysis and rollout evidence to give reviewers confidence."
source_id: "pr-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-generated PRs to remove stale flag references from codebase. Each PR includes impact analysis and rollout evidence to give reviewers confidence.

## Tools used

- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)
- [action_launchdarkly_generate](/tools/action-launchdarkly-generate.md)

## Runs in

- [pr_generation](/workflow/pr-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-flag-manager-end-to-end.md)

# Citations

- [Feature Flag Manager Operations Runbook](/documents/feature-flag-manager-runbook.md)
