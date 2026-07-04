---
type: Proof Obligation
title: "Golden eval obligation — Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-agent-commission-reconciliation-engine-end-to-end"
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

# Golden eval obligation — Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [agent-commission-reconciliation-engine-end-to-end](/tests/agent-commission-reconciliation-engine-end-to-end.md)


## Mechanisms

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [agent-commission-reconciliation-engine-authority-guide](/documents/agent-commission-reconciliation-engine-authority-guide.md)
