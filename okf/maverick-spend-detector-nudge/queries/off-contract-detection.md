---
type: Query Capability
title: Monitor PO creation events in real time. Compare each PO against contract and...
description: "Monitor PO creation events in real time. Compare each PO against contract and catalog coverage to identify non-catalog or off-contract purchases."
source_id: "off-contract-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor PO creation events in real time. Compare each PO against contract and catalog coverage to identify non-catalog or off-contract purchases.

## Tools used

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

## Runs in

- [off_contract_detection](/workflow/off-contract-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

# Citations

- [Maverick Spend Detector & Nudge Procurement Policy Guide](/documents/maverick-spend-detector-nudge-policy-guide.md)
