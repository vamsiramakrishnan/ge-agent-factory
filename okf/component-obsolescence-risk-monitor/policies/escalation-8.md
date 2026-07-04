---
type: Policy
title: Escalation policy 8
description: "When A cad_document_records entry for the affected part shows lifecycle_state 'obsolete' or 'superseded' with no corresponding released bom_revision on file; action: escalate_to_human; handoff: PLM Configuration Analyst"
source_id: "escalation-8"
tags:
  - manufacturing
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
| A cad_document_records entry for the affected part shows lifecycle_state 'obsolete' or 'superseded' with no corresponding released bom_revision on file | escalate_to_human | PLM Configuration Analyst | A missing released revision means the configuration baseline cannot be reconstructed, so exposure and last-time-buy math built on it cannot be trusted until the baseline is corrected. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
