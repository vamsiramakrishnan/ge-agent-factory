---
type: Query Capability
title: "Analyze CAPA completion rates, aging analysis, and recurrence patterns across..."
description: "Analyze CAPA completion rates, aging analysis, and recurrence patterns across suppliers and finding types. Detect systemic issues where similar findings repeat across multiple audit cycles."
source_id: "recurrence-pattern-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze CAPA completion rates, aging analysis, and recurrence patterns across suppliers and finding types. Detect systemic issues where similar findings repeat across multiple audit cycles.

## Tools used

- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)

## Runs in

- [recurrence_pattern_detection](/workflow/recurrence-pattern-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

# Citations

- [Audit & Corrective Action Tracker Procurement Policy Guide](/documents/audit-corrective-action-tracker-policy-guide.md)
