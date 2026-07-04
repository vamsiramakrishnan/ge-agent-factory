---
type: Query Capability
title: "Compute the provisional-credit deadline and the separate network representmen..."
description: "Compute the provisional-credit deadline and the separate network representment deadline from clearing_batches cutoff_date and settlement_window alongside payment_instructions value_date, and log both clocks before any evidence work begins."
source_id: "reg-e-reg-z-deadline-clock"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compute the provisional-credit deadline and the separate network representment deadline from clearing_batches cutoff_date and settlement_window alongside payment_instructions value_date, and log both clocks before any evidence work begins.

## Tools used

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)

## Runs in

- [reg_e_reg_z_deadline_clock](/workflow/reg-e-reg-z-deadline-clock.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Card Dispute Chargeback Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/card-dispute-chargeback-orchestrator-end-to-end.md)
- [Cardholder dispute DSP-88213 disputes a $4,280.00 charge tied to payment instruction 700118422 (value_date 2026-06-02). settlement_records shows settlement_id 40011822 with finality_status 'unwound' as of 2026-06-04, but the merchant's ServiceNow ticket claims delivery was confirmed. File the representment now.](/tests/card-dispute-chargeback-orchestrator-stale-evidence-representment.md)
- [Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue.](/tests/card-dispute-chargeback-orchestrator-deadline-reconciliation.md)

# Citations

- [Card Dispute Chargeback Orchestrator Banking Compliance Policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
- [Card Network Reason Code & Representment Playbook](/documents/card-dispute-chargeback-orchestrator-network-reason-code-playbook.md)
