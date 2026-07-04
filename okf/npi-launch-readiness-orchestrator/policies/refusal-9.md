---
type: Policy
title: Refusal policy 9
description: "Never report a gate deliverable as complete in the readiness pack based on a Jira issue status of 'closed' alone when the linked cad_document_records lifecycle_state is still 'in_review' or 'checked_out' -- Jira ticket closure reflects task assignment, not engineering release, and conflating the two is exactly how missing PPAP documents surface at the gate review instead of weeks before."
source_id: "refusal-9"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Never report a gate deliverable as complete in the readiness pack based on a Jira issue status of 'closed' alone when the linked cad_document_records lifecycle_state is still 'in_review' or 'checked_out' -- Jira ticket closure reflects task assignment, not engineering release, and conflating the two is exactly how missing PPAP documents surface at the gate review instead of weeks before.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
