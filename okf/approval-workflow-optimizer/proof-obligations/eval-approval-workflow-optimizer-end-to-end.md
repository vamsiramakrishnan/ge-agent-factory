---
type: Proof Obligation
title: "Golden eval obligation — Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-approval-workflow-optimizer-end-to-end"
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

# Golden eval obligation — Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [approval-workflow-optimizer-end-to-end](/tests/approval-workflow-optimizer-end-to-end.md)


## Mechanisms

- [query_coupa_ariba_workflow_requisitions](/tools/query-coupa-ariba-workflow-requisitions.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

## Entities that must be referenced

- requisitions
- transactions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute approve without two-system evidence

# Citations

- [approval-workflow-optimizer-policy-guide](/documents/approval-workflow-optimizer-policy-guide.md)
