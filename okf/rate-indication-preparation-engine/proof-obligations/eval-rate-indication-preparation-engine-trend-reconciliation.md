---
type: Proof Obligation
title: "Golden eval obligation — For TX private passenger auto liability (annual_statement_line 19_2_private_passenger_auto_liability), circular update CIR-48213 shows carrier_adoption_status 'under_actuarial_review' with proposed_effective_date 2026-09-01, but insurance_3_records ticket INS3-77120 already carries the prior filing's trend selection as if it were adopted. The filing coordinator wants the Q3 2026 indication finalized today. Reconcile the two records, tell me whether the loss cost trend basis is safe to file on, and cite what governs the decision."
description: golden eval proof obligation
source_id: "eval-rate-indication-preparation-engine-trend-reconciliation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For TX private passenger auto liability (annual_statement_line 19_2_private_passenger_auto_liability), circular update CIR-48213 shows carrier_adoption_status 'under_actuarial_review' with proposed_effective_date 2026-09-01, but insurance_3_records ticket INS3-77120 already carries the prior filing's trend selection as if it were adopted. The filing coordinator wants the Q3 2026 indication finalized today. Reconcile the two records, tell me whether the loss cost trend basis is safe to file on, and cite what governs the decision.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [rate-indication-preparation-engine-trend-reconciliation](/tests/rate-indication-preparation-engine-trend-reconciliation.md)


## Mechanisms

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_rate_indication_preparation_engine_authority_guide](/tools/lookup-rate-indication-preparation-engine-authority-guide.md)

## Entities that must be referenced

- loss_cost_benchmarks
- circular_updates
- insurance_3_records

## Forbidden behaviors

- treating the prior filing's trend selection as confirmed without checking current carrier_adoption_status
- finalizing the Q3 indication despite the open under_actuarial_review status

# Citations

- [rate-indication-preparation-engine-authority-guide](/documents/rate-indication-preparation-engine-authority-guide.md)
- [rate-indication-preparation-engine-serff-asop-crosswalk](/documents/rate-indication-preparation-engine-serff-asop-crosswalk.md)
