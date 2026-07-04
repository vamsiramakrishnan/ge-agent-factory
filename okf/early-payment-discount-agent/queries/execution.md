---
type: Query Capability
title: "Auto-execute early payments for discounts above the approved APR threshold. R..."
description: "Auto-execute early payments for discounts above the approved APR threshold. Record captured savings and update discount capture rate metrics."
source_id: execution
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-execute early payments for discounts above the approved APR threshold. Record captured savings and update discount capture rate metrics.

## Tools used

- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)

## Runs in

- [execution](/workflow/execution.md)

## Evidence expected

- document_reference

## Evals

- [Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-payment-discount-agent-end-to-end.md)

# Citations

- [Early Payment Discount Agent Controls Playbook](/documents/early-payment-discount-agent-controls-playbook.md)
