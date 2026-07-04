---
type: Query Capability
title: "Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 cu..."
description: "Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 currencies. EUR balances elevated post-quarter -- recommend sweeping $15M to USD concentration account to fund next week's bond payment.' Actionable, not just informational."
source_id: "treasury-briefing-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 currencies. EUR balances elevated post-quarter -- recommend sweeping $15M to USD concentration account to fund next week's bond payment.' Actionable, not just informational.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Runs in

- [treasury_briefing_generation](/workflow/treasury-briefing-generation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/liquidity-dashboard-end-to-end.md)

# Citations

- [Liquidity Dashboard Controls Playbook](/documents/liquidity-dashboard-controls-playbook.md)
