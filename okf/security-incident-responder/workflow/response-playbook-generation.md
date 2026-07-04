---
type: Workflow Stage
title: Response Playbook Generation
description: "Gemini generates a tailored incident response playbook based on attack type, affected assets, and business criticality. Recommends containment, eradication, and recovery steps."
source_id: response_playbook_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Response Playbook Generation

Gemini generates a tailored incident response playbook based on attack type, affected assets, and business criticality. Recommends containment, eradication, and recovery steps.

- **Mode:** sequential
- **Stage:** 2 of 2

## Tools

- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)
- [action_crowdstrike_generate](/tools/action-crowdstrike-generate.md)
