---
type: Query Capability
title: "Translate optimized workflow logic into MAP-specific configuration — HubSpot ..."
description: "Translate optimized workflow logic into MAP-specific configuration — HubSpot workflows, Marketo smart campaigns, or SFMC journeys. Set up correct branching, timing, and exclusion criteria."
source_id: "map-configuration"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Translate optimized workflow logic into MAP-specific configuration — HubSpot workflows, Marketo smart campaigns, or SFMC journeys. Set up correct branching, timing, and exclusion criteria.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [lookup_campaign_ops_workflow_builder_playbook](/tools/lookup-campaign-ops-workflow-builder-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Runs in

- [map_configuration](/workflow/map-configuration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-ops-workflow-builder-end-to-end.md)

# Citations

- [Campaign Ops Workflow Builder Playbook](/documents/campaign-ops-workflow-builder-playbook.md)
