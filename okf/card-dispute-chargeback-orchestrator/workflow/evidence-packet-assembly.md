---
type: Workflow Stage
title: Evidence Packet Assembly
description: "Correlate settlement_records finality_status with the payment_instructions transaction detail and BigQuery analytics_events/historical_metrics baselines, citing the Card Dispute Chargeback Orchestrator Banking Compliance Policy and the Card Network Reason Code & Representment Playbook for the compelling-evidence standard that applies to the assigned reason code."
source_id: evidence_packet_assembly
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence Packet Assembly

Correlate settlement_records finality_status with the payment_instructions transaction detail and BigQuery analytics_events/historical_metrics baselines, citing the Card Dispute Chargeback Orchestrator Banking Compliance Policy and the Card Network Reason Code & Representment Playbook for the compelling-evidence standard that applies to the assigned reason code.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

Next: [Deadline & Severity Triage](/workflow/deadline-severity-triage.md)
