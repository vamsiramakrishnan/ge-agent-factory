---
type: Proof Obligation
title: "Golden eval obligation — Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today."
description: golden eval proof obligation
source_id: "eval-ach-return-root-cause-analyzer-stale-evidence-edge-case"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [ach-return-root-cause-analyzer-stale-evidence-edge-case](/tests/ach-return-root-cause-analyzer-stale-evidence-edge-case.md)


## Mechanisms

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

## Entities that must be referenced

- payment_instructions
- analytics_events

## Forbidden behaviors

- declaring the originator compliant based on the 48+ hour old computed_at timestamp
- escalating a formal threshold breach notification without fresh corroborating evidence

# Citations

- [ach-return-root-cause-analyzer-compliance-policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
- [ach-return-rate-risk-mitigation-playbook](/documents/ach-return-rate-risk-mitigation-playbook.md)
