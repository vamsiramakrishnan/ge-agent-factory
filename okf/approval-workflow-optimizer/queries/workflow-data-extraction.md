---
type: Query Capability
title: Extract approval workflow data from Coupa/Ariba and SAP — approval timestamps...
description: "Extract approval workflow data from Coupa/Ariba and SAP — approval timestamps, queue depths, delegation patterns, and approval outcomes across all requisition and PO types."
source_id: "workflow-data-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract approval workflow data from Coupa/Ariba and SAP — approval timestamps, queue depths, delegation patterns, and approval outcomes across all requisition and PO types.

## Tools used

- [query_coupa_ariba_workflow_requisitions](/tools/query-coupa-ariba-workflow-requisitions.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

## Runs in

- [workflow_data_extraction](/workflow/workflow-data-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/approval-workflow-optimizer-end-to-end.md)

# Citations

- [Approval Workflow Optimizer Procurement Policy Guide](/documents/approval-workflow-optimizer-policy-guide.md)
