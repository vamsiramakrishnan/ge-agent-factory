---
type: Workflow Stage
title: Regulatory Exception Handling
description: "Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% withholding tax on management fees -- net payment at $1.8M and book $200K withholding.' Handles treaty rate applications and regulatory restrictions on cross-border netting."
source_id: regulatory_exception_handling
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Regulatory Exception Handling

Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% withholding tax on management fees -- net payment at $1.8M and book $200K withholding.' Handles treaty rate applications and regulatory restrictions on cross-border netting.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

Next: [Settlement & Posting](/workflow/settlement-posting.md)
