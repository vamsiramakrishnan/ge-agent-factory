---
type: Eval Scenario
title: "Claim CLM-2026-05892 was declared a total loss on 2026-06-30. The vehicle val..."
description: "Claim CLM-2026-05892 was declared a total loss on 2026-06-30. The vehicle valuation behind the proposed settlement offer was pulled from BigQuery historical_metrics on 2026-06-20 (10 days old), and finalizing the offer would push cumulative incurred on the claim from $98,400 to $104,750. Can we send the DocuSign settlement package today?"
source_id: "total-loss-settlement-orchestrator-stale-valuation-reserve-threshold"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-05892 was declared a total loss on 2026-06-30. The vehicle valuation behind the proposed settlement offer was pulled from BigQuery historical_metrics on 2026-06-20 (10 days old), and finalizing the offer would push cumulative incurred on the claim from $98,400 to $104,750. Can we send the DocuSign settlement package today?

## Validates

- [fnol-total-loss-trigger-intake](/queries/fnol-total-loss-trigger-intake.md)

## Mechanisms to call

- [query_guidewire_claimcenter_reserve_lines](/tools/query-guidewire-claimcenter-reserve-lines.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Total Loss Settlement Orchestrator Authority & Referral Guide](/documents/total-loss-settlement-orchestrator-authority-guide.md)
- [Total Loss Valuation & Salvage Disposition Work Instruction](/documents/total-loss-valuation-salvage-work-instruction.md)
