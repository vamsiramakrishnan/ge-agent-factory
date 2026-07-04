---
type: Query Capability
title: Conflict alerts pushed immediately via Slack. Weekly campaign digest with sch...
description: Conflict alerts pushed immediately via Slack. Weekly campaign digest with scheduling recommendations sent to marketing leadership.
source_id: "alert-digest-delivery"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Conflict alerts pushed immediately via Slack. Weekly campaign digest with scheduling recommendations sent to marketing leadership.

## Tools used

- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)
- [action_asana_recommend](/tools/action-asana-recommend.md)

## Runs in

- [alert_digest_delivery](/workflow/alert-digest-delivery.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-calendar-orchestrator-end-to-end.md)

# Citations

- [Campaign Calendar Orchestrator Playbook](/documents/campaign-calendar-orchestrator-playbook.md)
