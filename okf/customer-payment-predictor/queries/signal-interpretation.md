---
type: Query Capability
title: "Gemini interprets qualitative signals that change payment patterns: 'This cus..."
description: "Gemini interprets qualitative signals that change payment patterns: 'This customer shifted from Net 15 to Net 45 starting last quarter -- correlates with their announced ERP migration. Expected to normalize post-migration in Q3.' Adjusts predictions accordingly."
source_id: "signal-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets qualitative signals that change payment patterns: 'This customer shifted from Net 15 to Net 45 starting last quarter -- correlates with their announced ERP migration. Expected to normalize post-migration in Q3.' Adjusts predictions accordingly.

## Tools used

- [lookup_customer_payment_predictor_controls_playbook](/tools/lookup-customer-payment-predictor-controls-playbook.md)

## Runs in

- [signal_interpretation](/workflow/signal-interpretation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Customer Payment Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-payment-predictor-end-to-end.md)

# Citations

- [Customer Payment Predictor Controls Playbook](/documents/customer-payment-predictor-controls-playbook.md)
