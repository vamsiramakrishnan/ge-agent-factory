---
type: Query Capability
title: Feed adjusted payment predictions into the treasury cash flow forecast. Aggre...
description: Feed adjusted payment predictions into the treasury cash flow forecast. Aggregate by day and week for liquidity planning.
source_id: "forecast-integration"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Feed adjusted payment predictions into the treasury cash flow forecast. Aggregate by day and week for liquidity planning.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)

## Runs in

- [forecast_integration](/workflow/forecast-integration.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Customer Payment Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-payment-predictor-end-to-end.md)

# Citations

- [Customer Payment Predictor Controls Playbook](/documents/customer-payment-predictor-controls-playbook.md)
