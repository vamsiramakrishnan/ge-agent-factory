---
type: Proof Obligation
title: "Golden eval obligation — Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-unapplied-cash-resolution-agent-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [unapplied-cash-resolution-agent-end-to-end](/tests/unapplied-cash-resolution-agent-end-to-end.md)


## Mechanisms

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- insurance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [unapplied-cash-resolution-agent-authority-guide](/documents/unapplied-cash-resolution-agent-authority-guide.md)
