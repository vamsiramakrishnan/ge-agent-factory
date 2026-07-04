---
type: Query Capability
title: "Aggregate shared costs from IT, facilities, corporate functions into allocati..."
description: "Aggregate shared costs from IT, facilities, corporate functions into allocation pools. Validate completeness against prior periods."
source_id: "cost-pool-assembly"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate shared costs from IT, facilities, corporate functions into allocation pools. Validate completeness against prior periods.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_cost_allocation_agent_controls_playbook](/tools/lookup-cost-allocation-agent-controls-playbook.md)

## Runs in

- [cost_pool_assembly](/workflow/cost-pool-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-allocation-agent-end-to-end.md)

# Citations

- [Cost Allocation Agent Controls Playbook](/documents/cost-allocation-agent-controls-playbook.md)
