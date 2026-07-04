---
type: Query Capability
title: Optimize payment timing to balance DPO targets against discount APR opportuni...
description: "Optimize payment timing to balance DPO targets against discount APR opportunities. Model cash flow impact of different payment strategies with supplier-level segmentation."
source_id: "working-capital-optimization"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimize payment timing to balance DPO targets against discount APR opportunities. Model cash flow impact of different payment strategies with supplier-level segmentation.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)

## Runs in

- [working_capital_optimization](/workflow/working-capital-optimization.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-payment-optimizer-end-to-end.md)

# Citations

- [Vendor Payment Optimizer Controls Playbook](/documents/vendor-payment-optimizer-controls-playbook.md)
