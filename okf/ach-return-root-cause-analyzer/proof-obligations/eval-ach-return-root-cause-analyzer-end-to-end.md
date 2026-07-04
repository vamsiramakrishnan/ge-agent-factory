---
type: Proof Obligation
title: "Golden eval obligation — Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ach-return-root-cause-analyzer-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ach-return-root-cause-analyzer-end-to-end](/tests/ach-return-root-cause-analyzer-end-to-end.md)


## Mechanisms

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)

## Entities that must be referenced

- payment_instructions
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [ach-return-root-cause-analyzer-compliance-policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
