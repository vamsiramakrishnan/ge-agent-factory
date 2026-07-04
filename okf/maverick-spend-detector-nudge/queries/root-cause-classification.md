---
type: Query Capability
title: "Classify maverick spend by root cause: no catalog item exists, policy confusi..."
description: "Classify maverick spend by root cause: no catalog item exists, policy confusion, urgency bypass, or deliberate preference. Cluster patterns for weekly trend reporting."
source_id: "root-cause-classification"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify maverick spend by root cause: no catalog item exists, policy confusion, urgency bypass, or deliberate preference. Cluster patterns for weekly trend reporting.

## Tools used

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

## Runs in

- [root_cause_classification](/workflow/root-cause-classification.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

# Citations

- [Maverick Spend Detector & Nudge Procurement Policy Guide](/documents/maverick-spend-detector-nudge-policy-guide.md)
