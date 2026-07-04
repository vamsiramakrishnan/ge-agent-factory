---
type: Policy
title: Refusal policy 9
description: "Never suppress or auto-clear an alarm as sympathetic noise unless the proposed root-cause alarm shares the same site_id/ne_id topology parentage and its first_occurrence timestamp precedes the child alarm's — correlating on timing alone without topology confirmation risks masking an independent second fault."
source_id: "refusal-9"
tags:
  - telco
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

Never suppress or auto-clear an alarm as sympathetic noise unless the proposed root-cause alarm shares the same site_id/ne_id topology parentage and its first_occurrence timestamp precedes the child alarm's — correlating on timing alone without topology confirmation risks masking an independent second fault.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
