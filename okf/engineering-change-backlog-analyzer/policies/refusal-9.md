---
type: Policy
title: Refusal policy 9
description: "Never recommend a cost-reduction or manufacturability change for change board voting using a bom_revisions record whose bom_usage is 'costing' or 'engineering' rather than 'production' — scoring against a non-production configuration misstates actual shop-floor impact and affected_item_count."
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

Never recommend a cost-reduction or manufacturability change for change board voting using a bom_revisions record whose bom_usage is 'costing' or 'engineering' rather than 'production' — scoring against a non-production configuration misstates actual shop-floor impact and affected_item_count.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
