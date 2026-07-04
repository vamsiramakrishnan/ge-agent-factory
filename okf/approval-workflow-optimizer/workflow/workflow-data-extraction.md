---
type: Workflow Stage
title: Workflow Data Extraction
description: "Extract approval workflow data from Coupa/Ariba and SAP — approval timestamps, queue depths, delegation patterns, and approval outcomes across all requisition and PO types."
source_id: workflow_data_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Workflow Data Extraction

Extract approval workflow data from Coupa/Ariba and SAP — approval timestamps, queue depths, delegation patterns, and approval outcomes across all requisition and PO types.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_coupa_ariba_workflow_requisitions](/tools/query-coupa-ariba-workflow-requisitions.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

Next: [Pattern Detection & Simulation](/workflow/pattern-detection-simulation.md)
