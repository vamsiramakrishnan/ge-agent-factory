---
type: Query Capability
title: "Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% wi..."
description: "Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% withholding tax on management fees -- net payment at $1.8M and book $200K withholding.' Handles treaty rate applications and regulatory restrictions on cross-border netting."
source_id: "regulatory-exception-handling"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% withholding tax on management fees -- net payment at $1.8M and book $200K withholding.' Handles treaty rate applications and regulatory restrictions on cross-border netting.

## Tools used

- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

## Runs in

- [regulatory_exception_handling](/workflow/regulatory-exception-handling.md)

## Evidence expected

- document_reference

## Evals

- [Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-netting-agent-end-to-end.md)

# Citations

- [Intercompany Netting Agent Controls Playbook](/documents/intercompany-netting-agent-controls-playbook.md)
