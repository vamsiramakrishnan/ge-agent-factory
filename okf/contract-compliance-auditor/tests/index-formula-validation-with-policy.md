---
type: Eval Scenario
title: "Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Cur..."
description: "Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy."
source_id: "index-formula-validation-with-policy"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy.

## Validates

- [terms-actuals-extraction](/queries/terms-actuals-extraction.md)

## Mechanisms to call

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Success rubric

Pricing adjustment is valid: index move (5%) exceeds dead band (3%), capped at 6% = 6% adjustment allowed. Cite policy index-formula-validation anchor.

# Citations

- [Procurement Contract Compliance Policy](/documents/procurement-contract-compliance-policy.md)
