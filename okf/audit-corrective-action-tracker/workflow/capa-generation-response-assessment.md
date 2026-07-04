---
type: Workflow Stage
title: "CAPA Generation & Response Assessment"
description: "Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lots received without QC sign-off' — and auto-generates structured CAPA plans with root cause analysis, training requirements, and process modifications. Assesses whether a supplier's CAPA response actually addresses the root cause or is superficial."
source_id: capa_generation_response_assessment
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# CAPA Generation & Response Assessment

Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lots received without QC sign-off' — and auto-generates structured CAPA plans with root cause analysis, training requirements, and process modifications. Assesses whether a supplier's CAPA response actually addresses the root cause or is superficial.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)
