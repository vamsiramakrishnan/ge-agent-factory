---
type: Proof Obligation
title: "Golden eval obligation — Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue."
description: golden eval proof obligation
source_id: "eval-card-dispute-chargeback-orchestrator-deadline-reconciliation"
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

# Golden eval obligation — Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [card-dispute-chargeback-orchestrator-deadline-reconciliation](/tests/card-dispute-chargeback-orchestrator-deadline-reconciliation.md)


## Mechanisms

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

## Entities that must be referenced

- clearing_batches
- payment_instructions
- analytics_events

## Forbidden behaviors

- conflating the Reg E provisional-credit deadline with the network representment deadline as if they were identical
- deprioritizing the case despite deadline proximity because of an unrelated win-rate metric

# Citations

- [card-dispute-chargeback-orchestrator-network-reason-code-playbook](/documents/card-dispute-chargeback-orchestrator-network-reason-code-playbook.md)
- [card-dispute-chargeback-orchestrator-compliance-policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
