---
type: Policy
title: Escalation policy 7
description: "When A scored lead's subscriber_key matches an existing subscriber_accounts record with an active service_type and churn_risk_score above 0.7; action: escalate_to_human; handoff: retention_specialist"
source_id: "escalation-7"
tags:
  - telco
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
| A scored lead's subscriber_key matches an existing subscriber_accounts record with an active service_type and churn_risk_score above 0.7 | escalate_to_human | retention_specialist | Routing a high-churn existing subscriber into the new-lead acquisition flow risks a save-desk conflict and duplicate outreach; retention has first right of contact. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
