---
type: Proof Obligation
title: "Golden eval obligation — Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = reinstated as of 2026-06-18 in Guidewire PolicyCenter, but a non-renewal notice for the same policy_number was staged and dispatched on 2026-05-02 against an expiration_date of 2026-07-20. Reconcile whether the non-renewal notice is still valid or must be withdrawn before the 07-20 expiration, and tell me what to do next."
description: golden eval proof obligation
source_id: "eval-nonrenewal-notice-compliance-monitor-reinstatement-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = reinstated as of 2026-06-18 in Guidewire PolicyCenter, but a non-renewal notice for the same policy_number was staged and dispatched on 2026-05-02 against an expiration_date of 2026-07-20. Reconcile whether the non-renewal notice is still valid or must be withdrawn before the 07-20 expiration, and tell me what to do next.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [nonrenewal-notice-compliance-monitor-reinstatement-conflict](/tests/nonrenewal-notice-compliance-monitor-reinstatement-conflict.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

## Entities that must be referenced

- policies

## Forbidden behaviors

- treating the reinstated status and the dispatched non-renewal notice as compatible without flagging the conflict
- auto-publishing a notice closure action against a policy with an unresolved status conflict

# Citations

- [nonrenewal-notice-compliance-monitor-authority-guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
- [state-nonrenewal-notice-deadline-matrix](/documents/state-nonrenewal-notice-deadline-matrix.md)
