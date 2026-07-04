---
type: Query Capability
title: "Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lo..."
description: "Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lots received without QC sign-off' — and auto-generates structured CAPA plans with root cause analysis, training requirements, and process modifications. Assesses whether a supplier's CAPA response actually addresses the root cause or is superficial."
source_id: "capa-generation-response-assessment"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lots received without QC sign-off' — and auto-generates structured CAPA plans with root cause analysis, training requirements, and process modifications. Assesses whether a supplier's CAPA response actually addresses the root cause or is superficial.

## Tools used

- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)

## Runs in

- [capa_generation_response_assessment](/workflow/capa-generation-response-assessment.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

# Citations

- [Audit & Corrective Action Tracker Procurement Policy Guide](/documents/audit-corrective-action-tracker-policy-guide.md)
