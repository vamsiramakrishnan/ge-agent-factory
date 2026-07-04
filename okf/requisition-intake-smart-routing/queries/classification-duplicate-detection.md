---
type: Query Capability
title: Classify request type and urgency. Run fuzzy matching against recent requisit...
description: "Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests."
source_id: "classification-duplicate-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests.

## Tools used

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)
- [action_sap_s_4hana_mm_me51n_match](/tools/action-sap-s-4hana-mm-me51n-match.md)

## Runs in

- [classification_duplicate_detection](/workflow/classification-duplicate-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-smart-routing-end-to-end.md)

# Citations

- [Requisition Intake & Smart Routing Procurement Policy Guide](/documents/requisition-intake-smart-routing-policy-guide.md)
