---
type: Query Capability
title: Parse audit notification and information document requests into structured re...
description: "Parse audit notification and information document requests into structured requirements. Map each request to specific document types, time periods, and responsible teams."
source_id: "audit-request-parsing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse audit notification and information document requests into structured requirements. Map each request to specific document types, time periods, and responsible teams.

## Tools used

- [lookup_tax_audit_prep_agent_controls_playbook](/tools/lookup-tax-audit-prep-agent-controls-playbook.md)

## Runs in

- [audit_request_parsing](/workflow/audit-request-parsing.md)

## Evidence expected

- document_reference

## Evals

- [Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-audit-prep-agent-end-to-end.md)

# Citations

- [Tax Audit Prep Agent Controls Playbook](/documents/tax-audit-prep-agent-controls-playbook.md)
