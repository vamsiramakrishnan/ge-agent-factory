---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line."
description: golden eval proof obligation
source_id: "eval-medical-bill-review-engine-duplicate-reconciliation"
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

# Golden eval obligation — Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [medical-bill-review-engine-duplicate-reconciliation](/tests/medical-bill-review-engine-duplicate-reconciliation.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

## Entities that must be referenced

- claims
- claim_exposures
- analytics_events

## Forbidden behaviors

- recommending full denial without citing the specific coding edit or duplicate-match evidence
- calling action_guidewire_claimcenter_file before the duplicate determination is resolved

# Citations

- [medical-bill-review-engine-fee-schedule-playbook](/documents/medical-bill-review-engine-fee-schedule-playbook.md)
- [medical-bill-review-engine-authority-guide](/documents/medical-bill-review-engine-authority-guide.md)
