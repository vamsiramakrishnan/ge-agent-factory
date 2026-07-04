---
type: Query Capability
title: ML model trained on 3+ years of payment history predicts expected payment dat...
description: "ML model trained on 3+ years of payment history predicts expected payment date for each receivable. Outputs confidence intervals -- 80% probability of payment between Day 35 and Day 42 -- enabling probabilistic cash forecasting."
source_id: "payment-date-prediction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML model trained on 3+ years of payment history predicts expected payment date for each receivable. Outputs confidence intervals -- 80% probability of payment between Day 35 and Day 42 -- enabling probabilistic cash forecasting.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)

## Runs in

- [payment_date_prediction](/workflow/payment-date-prediction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Customer Payment Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-payment-predictor-end-to-end.md)

# Citations

- [Customer Payment Predictor Controls Playbook](/documents/customer-payment-predictor-controls-playbook.md)
