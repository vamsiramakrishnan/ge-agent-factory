---
type: Query Capability
title: Collect RFI and questionnaire responses from Ariba SLP or Jaggaer. Normalize ...
description: Collect RFI and questionnaire responses from Ariba SLP or Jaggaer. Normalize submissions across different formats and structures into a consistent evaluation framework.
source_id: "response-collection-normalization"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect RFI and questionnaire responses from Ariba SLP or Jaggaer. Normalize submissions across different formats and structures into a consistent evaluation framework.

## Tools used

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [lookup_capability_assessment_agent_policy_guide](/tools/lookup-capability-assessment-agent-policy-guide.md)
- [action_ariba_slp_recommend](/tools/action-ariba-slp-recommend.md)

## Runs in

- [response_collection_normalization](/workflow/response-collection-normalization.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capability-assessment-agent-end-to-end.md)

# Citations

- [Capability Assessment Agent Procurement Policy Guide](/documents/capability-assessment-agent-policy-guide.md)
