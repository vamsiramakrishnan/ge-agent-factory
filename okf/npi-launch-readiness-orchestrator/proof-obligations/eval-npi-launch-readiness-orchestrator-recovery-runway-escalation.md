---
type: Proof Obligation
title: "Golden eval obligation — Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?"
description: golden eval proof obligation
source_id: "eval-npi-launch-readiness-orchestrator-recovery-runway-escalation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [npi-launch-readiness-orchestrator-recovery-runway-escalation](/tests/npi-launch-readiness-orchestrator-recovery-runway-escalation.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Entities that must be referenced

- engineering_change_orders
- issues
- analytics_events
- historical_metrics

## Forbidden behaviors

- Reporting the tooling deliverable as on-track based on the function lead's verbal assurance alone
- Skipping the escalate action and burying the risk until the gate review

# Citations

- [npi-launch-readiness-orchestrator-sop](/documents/npi-launch-readiness-orchestrator-sop.md)
- [eccb-authority-effectivity-matrix](/documents/eccb-authority-effectivity-matrix.md)
