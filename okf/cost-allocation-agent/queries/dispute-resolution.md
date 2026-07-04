---
type: Query Capability
title: Gemini interprets allocation disputes from business units. Compares the impac...
description: "Gemini interprets allocation disputes from business units. Compares the impact of alternative drivers, assesses fairness, and recommends the method that best reflects resource consumption with documented rationale."
source_id: "dispute-resolution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets allocation disputes from business units. Compares the impact of alternative drivers, assesses fairness, and recommends the method that best reflects resource consumption with documented rationale.

## Tools used

- [lookup_cost_allocation_agent_controls_playbook](/tools/lookup-cost-allocation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [dispute_resolution](/workflow/dispute-resolution.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-allocation-agent-end-to-end.md)

# Citations

- [Cost Allocation Agent Controls Playbook](/documents/cost-allocation-agent-controls-playbook.md)
