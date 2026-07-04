---
type: Query Capability
title: Receive innovation proposals via supplier portal and log in tracking system. ...
description: "Receive innovation proposals via supplier portal and log in tracking system. Categorize proposals (material substitution, process improvement, design-to-cost) and route for technical evaluation."
source_id: "proposal-intake-triage"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive innovation proposals via supplier portal and log in tracking system. Categorize proposals (material substitution, process improvement, design-to-cost) and route for technical evaluation.

## Tools used

- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_innovation_management_innovation_management_records](/tools/query-innovation-management-innovation-management-records.md)
- [lookup_innovation_value_engineering_tracker_policy_guide](/tools/lookup-innovation-value-engineering-tracker-policy-guide.md)

## Runs in

- [proposal_intake_triage](/workflow/proposal-intake-triage.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/innovation-value-engineering-tracker-end-to-end.md)

# Citations

- [Innovation & Value Engineering Tracker Procurement Policy Guide](/documents/innovation-value-engineering-tracker-policy-guide.md)
