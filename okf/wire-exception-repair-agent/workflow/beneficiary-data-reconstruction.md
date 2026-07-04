---
type: Workflow Stage
title: Beneficiary data reconstruction
description: "Reconstruct the correct beneficiary_aba_routing and originator_name on each payment_instructions record by cross-referencing settlement_records history and BigQuery historical_metrics/analytics_events baselines for the same corridor."
source_id: beneficiary_data_reconstruction
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Beneficiary data reconstruction

Reconstruct the correct beneficiary_aba_routing and originator_name on each payment_instructions record by cross-referencing settlement_records history and BigQuery historical_metrics/analytics_events baselines for the same corridor.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)

Next: [Sanctions & BEC risk screening](/workflow/sanctions-bec-risk-screening.md)
