---
type: Query Capability
title: Parse business requirements document from the sourcing team. Pull RFx templat...
description: Parse business requirements document from the sourcing team. Pull RFx template from library. Populate header fields from requisition data in Ariba/Coupa/Jaggaer.
source_id: "requirements-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse business requirements document from the sourcing team. Pull RFx template from library. Populate header fields from requisition data in Ariba/Coupa/Jaggaer.

## Tools used

- [query_sap_ariba_sourcing_suppliers](/tools/query-sap-ariba-sourcing-suppliers.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_coupa_sourcing_requisitions](/tools/query-coupa-sourcing-requisitions.md)
- [lookup_rfx_builder_orchestrator_policy_guide](/tools/lookup-rfx-builder-orchestrator-policy-guide.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

## Runs in

- [requirements_ingestion](/workflow/requirements-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rfx-builder-orchestrator-end-to-end.md)

# Citations

- [RFx Builder & Orchestrator Procurement Policy Guide](/documents/rfx-builder-orchestrator-policy-guide.md)
