---
type: Policy
title: Escalation policy 8
description: "When transaction_risk_scores.mule_account_indicator is true on the same account where fraud_alerts.reg_e_claim_filed is also true; action: request_more_info; handoff: Fraud Operations"
source_id: "escalation-8"
tags:
  - banking
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
| transaction_risk_scores.mule_account_indicator is true on the same account where fraud_alerts.reg_e_claim_filed is also true | request_more_info | Fraud Operations | A customer-filed Reg E dispute and a mule-account signal on one account are contradictory victim/perpetrator theories that require additional counterparty evidence before the agent can recommend a disposition. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
