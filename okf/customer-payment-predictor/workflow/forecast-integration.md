---
type: Workflow Stage
title: Forecast Integration
description: Feed adjusted payment predictions into the treasury cash flow forecast. Aggregate by day and week for liquidity planning.
source_id: forecast_integration
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Forecast Integration

Feed adjusted payment predictions into the treasury cash flow forecast. Aggregate by day and week for liquidity planning.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)
