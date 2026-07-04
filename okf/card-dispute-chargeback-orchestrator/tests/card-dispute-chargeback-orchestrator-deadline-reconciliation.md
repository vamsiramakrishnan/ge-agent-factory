---
type: Eval Scenario
title: "Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, o..."
description: "Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue."
source_id: "card-dispute-chargeback-orchestrator-deadline-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue.

## Validates

- [evidence-packet-assembly](/queries/evidence-packet-assembly.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Card Network Reason Code & Representment Playbook](/documents/card-dispute-chargeback-orchestrator-network-reason-code-playbook.md)
- [Card Dispute Chargeback Orchestrator Banking Compliance Policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
