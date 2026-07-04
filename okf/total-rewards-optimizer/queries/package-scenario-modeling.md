---
type: Query Capability
title: "Gemini models multiple total rewards scenarios across base, bonus, equity, an..."
description: "Gemini models multiple total rewards scenarios across base, bonus, equity, and benefits. Evaluates trade-offs between cash and equity mix, internal equity impact, and retention correlation."
source_id: "package-scenario-modeling"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini models multiple total rewards scenarios across base, bonus, equity, and benefits. Evaluates trade-offs between cash and equity mix, internal equity impact, and retention correlation.

## Tools used

- [query_e_trade_e_trade_records](/tools/query-e-trade-e-trade-records.md)
- [lookup_total_rewards_optimizer_policy_handbook](/tools/lookup-total-rewards-optimizer-policy-handbook.md)

## Runs in

- [package_scenario_modeling](/workflow/package-scenario-modeling.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/total-rewards-optimizer-end-to-end.md)

# Citations

- [Total Rewards Optimizer Policy Handbook](/documents/total-rewards-optimizer-policy-handbook.md)
