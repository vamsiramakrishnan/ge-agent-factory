---
type: Policy
title: Escalation policy 8
description: "When A netting set's reported collateral coverage in positions relies on an ISDA/CSA agreement that cannot be confirmed in Murex MX.3 counterparty static data; action: request_more_info; handoff: collateral_operations"
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
| A netting set's reported collateral coverage in positions relies on an ISDA/CSA agreement that cannot be confirmed in Murex MX.3 counterparty static data | request_more_info | collateral_operations | Netting and collateral benefit cannot be recognized in the exposure view or capital calculation without a confirmed, legally enforceable master agreement on file, so the gap must be closed before the counterparty view is published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
