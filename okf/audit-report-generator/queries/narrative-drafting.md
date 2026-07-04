---
type: Query Capability
title: "Gemini drafts the full audit report — executive summary, detailed findings wi..."
description: "Gemini drafts the full audit report — executive summary, detailed findings with root cause analysis, recommendations with timelines. Adapts tone for different audiences: audit committee gets risk summary, management gets detailed remediation guidance."
source_id: "narrative-drafting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts the full audit report — executive summary, detailed findings with root cause analysis, recommendations with timelines. Adapts tone for different audiences: audit committee gets risk summary, management gets detailed remediation guidance.

## Tools used

- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)
- [action_auditboard_recommend](/tools/action-auditboard-recommend.md)

## Runs in

- [narrative_drafting](/workflow/narrative-drafting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-report-generator-end-to-end.md)

# Citations

- [Audit Report Generator Controls Playbook](/documents/audit-report-generator-controls-playbook.md)
