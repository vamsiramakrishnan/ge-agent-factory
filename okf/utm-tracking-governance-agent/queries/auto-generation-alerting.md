---
type: Query Capability
title: "Auto-generate compliant tracking URLs from campaign briefs. Alert teams on no..."
description: "Auto-generate compliant tracking URLs from campaign briefs. Alert teams on non-compliant parameters before campaign launch. Weekly audit report on UTM hygiene."
source_id: "auto-generation-alerting"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-generate compliant tracking URLs from campaign briefs. Alert teams on non-compliant parameters before campaign launch. Weekly audit report on UTM hygiene.

## Tools used

- [lookup_utm_tracking_governance_agent_playbook](/tools/lookup-utm-tracking-governance-agent-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Runs in

- [auto_generation_alerting](/workflow/auto-generation-alerting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/utm-tracking-governance-agent-end-to-end.md)

# Citations

- [UTM & Tracking Governance Agent Playbook](/documents/utm-tracking-governance-agent-playbook.md)
