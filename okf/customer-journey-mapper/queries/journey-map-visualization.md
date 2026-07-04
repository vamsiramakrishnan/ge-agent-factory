---
type: Query Capability
title: "Generate visual journey maps per segment with drop-off hotspots and recommend..."
description: "Generate visual journey maps per segment with drop-off hotspots and recommended marketing interventions. Publish to Looker for ongoing monitoring."
source_id: "journey-map-visualization"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate visual journey maps per segment with drop-off hotspots and recommended marketing interventions. Publish to Looker for ongoing monitoring.

## Tools used

- [lookup_customer_journey_mapper_playbook](/tools/lookup-customer-journey-mapper-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [journey_map_visualization](/workflow/journey-map-visualization.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Customer Journey Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-journey-mapper-end-to-end.md)

# Citations

- [Customer Journey Mapper Playbook](/documents/customer-journey-mapper-playbook.md)
