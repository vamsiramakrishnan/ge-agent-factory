---
type: Query Capability
title: Attribute spend to certified diverse suppliers by classification (MBE/WBE/SDV...
description: "Attribute spend to certified diverse suppliers by classification (MBE/WBE/SDVOB/HUBZone). Aggregate tier-2 reporting from prime supplier submissions. Goal-vs-actual tracking with trend analysis by category and BU."
source_id: "spend-attribution-goal-tracking"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Attribute spend to certified diverse suppliers by classification (MBE/WBE/SDVOB/HUBZone). Aggregate tier-2 reporting from prime supplier submissions. Goal-vs-actual tracking with trend analysis by category and BU.

## Tools used

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)
- [action_supplier_io_generate](/tools/action-supplier-io-generate.md)

## Runs in

- [spend_attribution_goal_tracking](/workflow/spend-attribution-goal-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

# Citations

- [Supplier Diversity Tracker Procurement Policy Guide](/documents/supplier-diversity-tracker-policy-guide.md)
