---
type: Policy
title: Escalation policy 4
description: "When Service has been flagged with security_tag or contains sensitive_data in recent deployments; action: refuse"
source_id: "escalation-4"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Service has been flagged with security_tag or contains sensitive_data in recent deployments | refuse |  | Do not execute automatic remediation on security-sensitive services; require explicit Security team approval. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
