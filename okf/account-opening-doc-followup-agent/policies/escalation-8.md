---
type: Policy
title: Escalation policy 8
description: "When A required account-opening envelope in DocuSign shows status expired or terminated in envelopes with no completed entry in audit_trails, and the linked core_accounts record still has an outstanding identity-verification document; action: escalate_to_human; handoff: bsa_cip_compliance_officer"
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
| A required account-opening envelope in DocuSign shows status expired or terminated in envelopes with no completed entry in audit_trails, and the linked core_accounts record still has an outstanding identity-verification document | escalate_to_human | bsa_cip_compliance_officer | An expired identity-verification envelope leaves the account's CIP file incomplete; a BSA compliance officer, not another automated reminder, must decide whether to restrict the account pending re-verification. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
