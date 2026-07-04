---
type: Workflow Stage
title: Requirements Ingestion
description: Parse business requirements document from the sourcing team. Pull RFx template from library. Populate header fields from requisition data in Ariba/Coupa/Jaggaer.
source_id: requirements_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Requirements Ingestion

Parse business requirements document from the sourcing team. Pull RFx template from library. Populate header fields from requisition data in Ariba/Coupa/Jaggaer.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_ariba_sourcing_suppliers](/tools/query-sap-ariba-sourcing-suppliers.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_coupa_sourcing_requisitions](/tools/query-coupa-sourcing-requisitions.md)
- [lookup_rfx_builder_orchestrator_policy_guide](/tools/lookup-rfx-builder-orchestrator-policy-guide.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

Next: [Shortlist & Response Prediction](/workflow/shortlist-response-prediction.md)
