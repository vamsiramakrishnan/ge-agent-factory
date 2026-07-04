---
type: Policy
title: Escalation policy 8
description: "When current_balance on a flagged dormant account exceeds $50,000 or the account's product_type is iolta or hsa; action: escalate_to_human; handoff: escheatment_compliance_officer"
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
| current_balance on a flagged dormant account exceeds $50,000 or the account's product_type is iolta or hsa | escalate_to_human | escheatment_compliance_officer | High-value and specialty-titled accounts (IOLTA trust funds, HSA custodial accounts) carry additional fiduciary and tax-reporting obligations that exceed the agent's delegated authority to remediate or file. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
