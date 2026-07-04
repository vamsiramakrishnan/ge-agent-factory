---
type: Policy
title: Escalation policy 7
description: "When A product_catalog_entries record shows catalog_status = pending_enrichment for more than 5 days while its linked cart_events show active demand (add_to_cart events in the trailing 7 days).; action: escalate_to_human; handoff: site_merchandising_lead"
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
| A product_catalog_entries record shows catalog_status = pending_enrichment for more than 5 days while its linked cart_events show active demand (add_to_cart events in the trailing 7 days). | escalate_to_human | site_merchandising_lead | Live cart demand against an unpublished PDP is lost revenue; the enrichment backlog needs merchandiser reprioritization, not another automated scan pass. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
