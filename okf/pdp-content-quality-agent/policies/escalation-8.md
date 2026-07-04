---
type: Policy
title: Escalation policy 8
description: "When Supplier content feed data for a SKU conflicts with the currently live product_catalog_entries content (rich_content_flag drops from true to false, or image_count shrinks) with no corresponding change ticket on file.; action: request_more_info; handoff: supplier_content_operations_lead"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Supplier content feed data for a SKU conflicts with the currently live product_catalog_entries content (rich_content_flag drops from true to false, or image_count shrinks) with no corresponding change ticket on file. | request_more_info | supplier_content_operations_lead | An unexplained feed regression is as likely to be a supplier data error as an intentional content pull; publishing over it risks overwriting good content with a bad feed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
