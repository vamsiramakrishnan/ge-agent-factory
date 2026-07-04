---
type: Query Capability
title: "Create campaign in MAP with email sequences, lead scoring rules, UTM tracking..."
description: "Create campaign in MAP with email sequences, lead scoring rules, UTM tracking, and Salesforce campaign. Coordinate multi-channel launch timing."
source_id: "campaign-setup"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create campaign in MAP with email sequences, lead scoring rules, UTM tracking, and Salesforce campaign. Coordinate multi-channel launch timing.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_campaign_builder_orchestrator_playbook](/tools/lookup-campaign-builder-orchestrator-playbook.md)

## Runs in

- [campaign_setup](/workflow/campaign-setup.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-builder-orchestrator-end-to-end.md)

# Citations

- [Campaign Builder & Orchestrator Playbook](/documents/campaign-builder-orchestrator-playbook.md)
