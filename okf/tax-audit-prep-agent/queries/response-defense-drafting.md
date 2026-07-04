---
type: Query Capability
title: "Gemini drafts audit responses: 'IRS questioning $4.5M R&D credit. Compile qua..."
description: "Gemini drafts audit responses: 'IRS questioning $4.5M R&D credit. Compile qualifying project documentation and timesheets. Cite Reg. 1.41-4(a) with project-level nexus to qualified research activities.' Creates defense narrative with regulatory citations."
source_id: "response-defense-drafting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts audit responses: 'IRS questioning $4.5M R&D credit. Compile qualifying project documentation and timesheets. Cite Reg. 1.41-4(a) with project-level nexus to qualified research activities.' Creates defense narrative with regulatory citations.

## Tools used

- [lookup_tax_audit_prep_agent_controls_playbook](/tools/lookup-tax-audit-prep-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Runs in

- [response_defense_drafting](/workflow/response-defense-drafting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-audit-prep-agent-end-to-end.md)

# Citations

- [Tax Audit Prep Agent Controls Playbook](/documents/tax-audit-prep-agent-controls-playbook.md)
