---
type: Query Capability
title: "Gemini generates a tailored incident response playbook based on attack type, ..."
description: "Gemini generates a tailored incident response playbook based on attack type, affected assets, and business criticality. Recommends containment, eradication, and recovery steps."
source_id: "response-playbook-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates a tailored incident response playbook based on attack type, affected assets, and business criticality. Recommends containment, eradication, and recovery steps.

## Tools used

- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)
- [action_crowdstrike_generate](/tools/action-crowdstrike-generate.md)

## Runs in

- [response_playbook_generation](/workflow/response-playbook-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/security-incident-responder-end-to-end.md)

# Citations

- [Security Incident Responder Operations Runbook](/documents/security-incident-responder-runbook.md)
