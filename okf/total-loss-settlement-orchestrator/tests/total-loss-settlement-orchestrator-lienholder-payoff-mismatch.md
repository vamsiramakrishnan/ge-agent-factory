---
type: Eval Scenario
title: "Claim CLM-2026-04471 (vehicle declared a total loss) shows a lienholder payof..."
description: "Claim CLM-2026-04471 (vehicle declared a total loss) shows a lienholder payoff of $18,250.00 recorded in reserve_lines, but the DocuSign envelope ENV-77201 sent to the lienholder confirms a payoff of $19,100.00. Reconcile the discrepancy and tell me whether we can release the settlement check and title today."
source_id: "total-loss-settlement-orchestrator-lienholder-payoff-mismatch"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-04471 (vehicle declared a total loss) shows a lienholder payoff of $18,250.00 recorded in reserve_lines, but the DocuSign envelope ENV-77201 sent to the lienholder confirms a payoff of $19,100.00. Reconcile the discrepancy and tell me whether we can release the settlement check and title today.

## Validates

- [coverage-lienholder-verification](/queries/coverage-lienholder-verification.md)

## Mechanisms to call

- [query_guidewire_claimcenter_reserve_lines](/tools/query-guidewire-claimcenter-reserve-lines.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Total Loss Valuation & Salvage Disposition Work Instruction](/documents/total-loss-valuation-salvage-work-instruction.md)
- [Total Loss Settlement Orchestrator Authority & Referral Guide](/documents/total-loss-settlement-orchestrator-authority-guide.md)
