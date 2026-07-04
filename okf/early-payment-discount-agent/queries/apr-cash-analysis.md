---
type: Query Capability
title: Calculate annualized return (APR) for each discount opportunity. Compare agai...
description: "Calculate annualized return (APR) for each discount opportunity. Compare against company WACC and check cash availability to ensure liquidity isn't compromised."
source_id: "apr-cash-analysis"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate annualized return (APR) for each discount opportunity. Compare against company WACC and check cash availability to ensure liquidity isn't compromised.

## Tools used

- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)

## Runs in

- [apr_cash_analysis](/workflow/apr-cash-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-payment-discount-agent-end-to-end.md)

# Citations

- [Early Payment Discount Agent Controls Playbook](/documents/early-payment-discount-agent-controls-playbook.md)
