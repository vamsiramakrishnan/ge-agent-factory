---
type: Eval Scenario
title: "Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = re..."
description: "Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = reinstated as of 2026-06-18 in Guidewire PolicyCenter, but a non-renewal notice for the same policy_number was staged and dispatched on 2026-05-02 against an expiration_date of 2026-07-20. Reconcile whether the non-renewal notice is still valid or must be withdrawn before the 07-20 expiration, and tell me what to do next."
source_id: "nonrenewal-notice-compliance-monitor-reinstatement-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = reinstated as of 2026-06-18 in Guidewire PolicyCenter, but a non-renewal notice for the same policy_number was staged and dispatched on 2026-05-02 against an expiration_date of 2026-07-20. Reconcile whether the non-renewal notice is still valid or must be withdrawn before the 07-20 expiration, and tell me what to do next.

## Validates

- [non-renewal-candidate-identification](/queries/non-renewal-candidate-identification.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Non-Renewal Notice Compliance Monitor Authority & Referral Guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
- [State Non-Renewal Notice Deadline & Delivery Method Matrix](/documents/state-nonrenewal-notice-deadline-matrix.md)
