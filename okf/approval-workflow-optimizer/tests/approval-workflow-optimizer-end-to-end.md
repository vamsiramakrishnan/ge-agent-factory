---
type: Eval Scenario
title: Run the Approval Workflow Optimizer workflow for the current period. Cite the...
description: "Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "approval-workflow-optimizer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [workflow-data-extraction](/queries/workflow-data-extraction.md)

## Mechanisms to call

- [query_coupa_ariba_workflow_requisitions](/tools/query-coupa-ariba-workflow-requisitions.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

## Success rubric

Action approve executed against Coupa/Ariba Workflow, with audit-trail entry and P2P Operations Manager notified of outcomes.

# Citations

- [Approval Workflow Optimizer Procurement Policy Guide](/documents/approval-workflow-optimizer-policy-guide.md)
