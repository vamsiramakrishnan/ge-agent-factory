---
type: Agent Tool
title: query_icertis_pricing_schedules
description: "Extract pricing schedules from contract: base price, index basis, dead band, cap percentage, SKU references."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_icertis_pricing_schedules

Extract pricing schedules from contract: base price, index basis, dead band, cap percentage, SKU references.

- **Kind:** query
- **Source system:** [Icertis](/systems/icertis.md)

## Inputs

- contract_id

## Outputs

- pricing_schedule_set

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Icertis](/systems/icertis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [terms_actuals_extraction](/workflow/terms-actuals-extraction.md)
- [pricing_volume_compliance_analysis](/workflow/pricing-volume-compliance-analysis.md)
- [formula_interpretation_advisory](/workflow/formula-interpretation-advisory.md)

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)
- [Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy.](/tests/index-formula-validation-with-policy.md)

## Evidence emitted

- source_system_record

## Required inputs

- contract_id

## Produces

- pricing_schedule_set

# Examples

```
query_icertis_pricing_schedules(contract_id=<contract_id>)
```

# Citations

- [Icertis](/systems/icertis.md)
