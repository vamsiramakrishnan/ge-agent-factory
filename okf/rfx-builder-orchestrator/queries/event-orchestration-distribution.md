---
type: Query Capability
title: Distribute approved RFP via Ariba/Coupa sourcing portal. Track deadlines and ...
description: "Distribute approved RFP via Ariba/Coupa sourcing portal. Track deadlines and send reminders. Manage Q&A routing between suppliers and sourcing team. Collect and normalize bid responses."
source_id: "event-orchestration-distribution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Distribute approved RFP via Ariba/Coupa sourcing portal. Track deadlines and send reminders. Manage Q&A routing between suppliers and sourcing team. Collect and normalize bid responses.

## Tools used

- [query_sap_ariba_sourcing_suppliers](/tools/query-sap-ariba-sourcing-suppliers.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_coupa_sourcing_requisitions](/tools/query-coupa-sourcing-requisitions.md)
- [lookup_rfx_builder_orchestrator_policy_guide](/tools/lookup-rfx-builder-orchestrator-policy-guide.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

## Runs in

- [event_orchestration_distribution](/workflow/event-orchestration-distribution.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rfx-builder-orchestrator-end-to-end.md)

# Citations

- [RFx Builder & Orchestrator Procurement Policy Guide](/documents/rfx-builder-orchestrator-policy-guide.md)
