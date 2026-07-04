---
type: Eval Scenario
title: "Run the RFx Builder & Orchestrator workflow for the current period. Cite the ..."
description: "Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "rfx-builder-orchestrator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [requirements-ingestion](/queries/requirements-ingestion.md)

## Mechanisms to call

- [query_sap_ariba_sourcing_suppliers](/tools/query-sap-ariba-sourcing-suppliers.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_coupa_sourcing_requisitions](/tools/query-coupa-sourcing-requisitions.md)
- [lookup_rfx_builder_orchestrator_policy_guide](/tools/lookup-rfx-builder-orchestrator-policy-guide.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

## Success rubric

Action generate executed against SAP Ariba Sourcing, with audit-trail entry and Strategic Sourcing Lead notified of outcomes.

# Citations

- [RFx Builder & Orchestrator Procurement Policy Guide](/documents/rfx-builder-orchestrator-policy-guide.md)
