---
type: Proof Obligation
title: "Golden eval obligation — Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-duplicate-payment-detector-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [duplicate-payment-detector-end-to-end](/tests/duplicate-payment-detector-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)
- [action_sap_s_4hana_fi_submit](/tools/action-sap-s-4hana-fi-submit.md)

## Entities that must be referenced

- gl_entries
- requisitions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute submit without two-system evidence

# Citations

- [duplicate-payment-detector-policy-guide](/documents/duplicate-payment-detector-policy-guide.md)
