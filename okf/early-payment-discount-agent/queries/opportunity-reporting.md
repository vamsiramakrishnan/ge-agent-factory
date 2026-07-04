---
type: Query Capability
title: "Gemini generates opportunity report summarizing total available discounts, an..."
description: "Gemini generates opportunity report summarizing total available discounts, annualized return, and recommended capture threshold. Highlights the most cost-effective opportunities."
source_id: "opportunity-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates opportunity report summarizing total available discounts, annualized return, and recommended capture threshold. Highlights the most cost-effective opportunities.

## Tools used

- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Runs in

- [opportunity_reporting](/workflow/opportunity-reporting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-payment-discount-agent-end-to-end.md)

# Citations

- [Early Payment Discount Agent Controls Playbook](/documents/early-payment-discount-agent-controls-playbook.md)
