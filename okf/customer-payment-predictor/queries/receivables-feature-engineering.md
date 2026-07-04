---
type: Query Capability
title: "Extract open receivables with 30+ features: customer segment, invoice amount,..."
description: "Extract open receivables with 30+ features: customer segment, invoice amount, day-of-week issued, industry, payment terms, historical average days-to-pay, dispute frequency, and seasonal patterns."
source_id: "receivables-feature-engineering"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract open receivables with 30+ features: customer segment, invoice amount, day-of-week issued, industry, payment terms, historical average days-to-pay, dispute frequency, and seasonal patterns.

## Tools used

- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)

## Runs in

- [receivables_feature_engineering](/workflow/receivables-feature-engineering.md)

## Evidence expected

- document_reference

## Evals

- [Run the Customer Payment Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-payment-predictor-end-to-end.md)

# Citations

- [Customer Payment Predictor Controls Playbook](/documents/customer-payment-predictor-controls-playbook.md)
