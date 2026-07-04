---
type: Policy
title: Escalation policy 7
description: "When fraud_alerts.alert_type is elder_financial_exploitation and involves an account holder with an unusual pattern of large withdrawals or a newly added third-party payee; action: escalate_to_human; handoff: adult_protective_services_liaison"
source_id: "escalation-7"
tags:
  - banking
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
| fraud_alerts.alert_type is elder_financial_exploitation and involves an account holder with an unusual pattern of large withdrawals or a newly added third-party payee | escalate_to_human | adult_protective_services_liaison | Many states mandate Adult Protective Services reporting within 24-48 hours for suspected elder financial exploitation, and that mandatory-reporting determination cannot be made by the triage agent. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
