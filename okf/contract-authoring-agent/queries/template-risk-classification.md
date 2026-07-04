---
type: Query Capability
title: Classify contract by type/value/risk tier to select correct template. Predict...
description: "Classify contract by type/value/risk tier to select correct template. Predict historical cycle time for this contract profile and flag non-standard deal structures."
source_id: "template-risk-classification"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify contract by type/value/risk tier to select correct template. Predict historical cycle time for this contract profile and flag non-standard deal structures.

## Tools used

- [lookup_contract_authoring_agent_policy_guide](/tools/lookup-contract-authoring-agent-policy-guide.md)

## Runs in

- [template_risk_classification](/workflow/template-risk-classification.md)

## Evidence expected

- document_reference

## Evals

- [Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/contract-authoring-agent-end-to-end.md)

# Citations

- [Contract Authoring Agent Procurement Policy Guide](/documents/contract-authoring-agent-policy-guide.md)
