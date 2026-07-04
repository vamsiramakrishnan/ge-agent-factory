---
type: Query Capability
title: Execute approved allocation cycles in SAP CO. Generate variance reports compa...
description: Execute approved allocation cycles in SAP CO. Generate variance reports comparing current vs. prior period allocations.
source_id: "posting-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute approved allocation cycles in SAP CO. Generate variance reports comparing current vs. prior period allocations.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_cost_allocation_agent_controls_playbook](/tools/lookup-cost-allocation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [posting_reporting](/workflow/posting-reporting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-allocation-agent-end-to-end.md)

# Citations

- [Cost Allocation Agent Controls Playbook](/documents/cost-allocation-agent-controls-playbook.md)
