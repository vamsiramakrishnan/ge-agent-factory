---
type: Workflow Stage
title: Payment Date Prediction
description: "ML model trained on 3+ years of payment history predicts expected payment date for each receivable. Outputs confidence intervals -- 80% probability of payment between Day 35 and Day 42 -- enabling probabilistic cash forecasting."
source_id: payment_date_prediction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Payment Date Prediction

ML model trained on 3+ years of payment history predicts expected payment date for each receivable. Outputs confidence intervals -- 80% probability of payment between Day 35 and Day 42 -- enabling probabilistic cash forecasting.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)

Next: [Signal Interpretation](/workflow/signal-interpretation.md)
