---
type: Query Capability
title: "Gemini interprets complex cases: 'Royalty to UK entity subject to 0% withhold..."
description: "Gemini interprets complex cases: 'Royalty to UK entity subject to 0% withholding under US-UK treaty Article 12 -- but only if beneficial owner is the UK entity itself, not a PE. Verify beneficial ownership before applying treaty rate.' Handles mixed payments and PE allocations."
source_id: "treaty-provision-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets complex cases: 'Royalty to UK entity subject to 0% withholding under US-UK treaty Article 12 -- but only if beneficial owner is the UK entity itself, not a PE. Verify beneficial ownership before applying treaty rate.' Handles mixed payments and PE allocations.

## Tools used

- [lookup_withholding_tax_agent_controls_playbook](/tools/lookup-withholding-tax-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_provision](/tools/action-sap-s-4hana-fi-provision.md)

## Runs in

- [treaty_provision_interpretation](/workflow/treaty-provision-interpretation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/withholding-tax-agent-end-to-end.md)

# Citations

- [Withholding Tax Agent Controls Playbook](/documents/withholding-tax-agent-controls-playbook.md)
