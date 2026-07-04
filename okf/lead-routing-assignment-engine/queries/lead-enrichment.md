---
type: Query Capability
title: Receive MQL from HubSpot with behavioral and firmographic data. Enrich with c...
description: "Receive MQL from HubSpot with behavioral and firmographic data. Enrich with company domain lookup, LinkedIn company data, and historical engagement signals."
source_id: "lead-enrichment"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive MQL from HubSpot with behavioral and firmographic data. Enrich with company domain lookup, LinkedIn company data, and historical engagement signals.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_lead_routing_assignment_engine_playbook](/tools/lookup-lead-routing-assignment-engine-playbook.md)

## Runs in

- [lead_enrichment](/workflow/lead-enrichment.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-routing-assignment-engine-end-to-end.md)

# Citations

- [Lead Routing & Assignment Engine Playbook](/documents/lead-routing-assignment-engine-playbook.md)
