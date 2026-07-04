---
type: Query Capability
title: Gemini reads the requirements document and drafts tailored evaluation criteri...
description: "Gemini reads the requirements document and drafts tailored evaluation criteria — understanding that 'extreme temperature environments' means different things for aerospace vs. food processing. Generates contextual clarification questions when supplier responses are ambiguous."
source_id: "rfp-drafting-q-a"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads the requirements document and drafts tailored evaluation criteria — understanding that 'extreme temperature environments' means different things for aerospace vs. food processing. Generates contextual clarification questions when supplier responses are ambiguous.

## Tools used

- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

## Runs in

- [rfp_drafting_q_a](/workflow/rfp-drafting-q-a.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rfx-builder-orchestrator-end-to-end.md)

# Citations

- [RFx Builder & Orchestrator Procurement Policy Guide](/documents/rfx-builder-orchestrator-policy-guide.md)
