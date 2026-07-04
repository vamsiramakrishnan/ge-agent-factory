---
type: Query Capability
title: "Gemini investigates significant variances: Is the material price variance mar..."
description: "Gemini investigates significant variances: Is the material price variance market-wide or supplier-specific? Is the labor efficiency variance driven by a process change or training gap? Generates corrective action recommendations."
source_id: "root-cause-reasoning"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates significant variances: Is the material price variance market-wide or supplier-specific? Is the labor efficiency variance driven by a process change or training gap? Generates corrective action recommendations.

## Tools used

- [lookup_standard_cost_variance_agent_controls_playbook](/tools/lookup-standard-cost-variance-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [root_cause_reasoning](/workflow/root-cause-reasoning.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Standard Cost Variance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/standard-cost-variance-agent-end-to-end.md)

# Citations

- [Standard Cost Variance Agent Controls Playbook](/documents/standard-cost-variance-agent-controls-playbook.md)
