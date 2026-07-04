---
type: Policy
title: Escalation policy 8
description: "When The ranked contact-driver report would attribute more than 15% of a queue's repeat contacts to a driver corroborated by fewer than 10 customer_interactions records; action: request_more_info; handoff: Care Team Lead"
source_id: "escalation-8"
tags:
  - telco
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
| The ranked contact-driver report would attribute more than 15% of a queue's repeat contacts to a driver corroborated by fewer than 10 customer_interactions records | request_more_info | Care Team Lead | Attributing a large repeat-contact share to a low-sample-size driver risks misdirecting remediation spend on a false signal; the analyzer should hold the ranking until enough interactions accumulate to make the driver statistically credible. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
