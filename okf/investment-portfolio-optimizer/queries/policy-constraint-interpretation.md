---
type: Query Capability
title: "Gemini reads investment policy and interprets constraints: 'Policy limits sin..."
description: "Gemini reads investment policy and interprets constraints: 'Policy limits single-issuer exposure to 10% but the new T-bill at 5.2% yield is attractive. At current portfolio size, you can allocate $8M without breaching.' Generates recommendation narrative."
source_id: "policy-constraint-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads investment policy and interprets constraints: 'Policy limits single-issuer exposure to 10% but the new T-bill at 5.2% yield is attractive. At current portfolio size, you can allocate $8M without breaching.' Generates recommendation narrative.

## Tools used

- [lookup_investment_portfolio_optimizer_controls_playbook](/tools/lookup-investment-portfolio-optimizer-controls-playbook.md)

## Runs in

- [policy_constraint_interpretation](/workflow/policy-constraint-interpretation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investment-portfolio-optimizer-end-to-end.md)

# Citations

- [Investment Portfolio Optimizer Controls Playbook](/documents/investment-portfolio-optimizer-controls-playbook.md)
