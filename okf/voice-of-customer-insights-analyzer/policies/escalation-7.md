---
type: Policy
title: Escalation policy 7
description: "When A single theme accounts for more than 15% of the period's flagged tickets and ties to a product_catalog_entries SKU whose content_completeness_score is above 0.8 (ruling out a content/listing defect) within one weekly run; action: escalate_to_human; handoff: Quality Assurance Lead"
source_id: "escalation-7"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A single theme accounts for more than 15% of the period's flagged tickets and ties to a product_catalog_entries SKU whose content_completeness_score is above 0.8 (ruling out a content/listing defect) within one weekly run | escalate_to_human | Quality Assurance Lead | A high-concentration theme against a well-documented SKU points to an actual product or vendor defect that needs a QA hold decision, not just a brief mention. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
