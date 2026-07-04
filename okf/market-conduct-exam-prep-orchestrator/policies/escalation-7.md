---
type: Policy
title: Escalation policy 7
description: "When Self-audit detects the same NAIC standard violated in more than 15% of sampled policies across two consecutive data mart refresh cycles; action: escalate_to_human; handoff: Chief Compliance Officer"
source_id: "escalation-7"
tags:
  - insurance
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
| Self-audit detects the same NAIC standard violated in more than 15% of sampled policies across two consecutive data mart refresh cycles | escalate_to_human | Chief Compliance Officer | A recurring violation pattern across refresh cycles indicates a systemic conduct issue that exceeds a single Regulatory Affairs Manager's remediation authority and may trigger voluntary self-report obligations to the domiciliary regulator. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
