---
type: Query Capability
title: "Pull award decision data — supplier details, negotiated pricing, terms, and r..."
description: "Pull award decision data — supplier details, negotiated pricing, terms, and risk tier — from sourcing system. Select appropriate contract template from CLM based on contract type, value, and jurisdiction."
source_id: "award-data-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull award decision data — supplier details, negotiated pricing, terms, and risk tier — from sourcing system. Select appropriate contract template from CLM based on contract type, value, and jurisdiction.

## Tools used

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_contract_authoring_agent_policy_guide](/tools/lookup-contract-authoring-agent-policy-guide.md)

## Runs in

- [award_data_ingestion](/workflow/award-data-ingestion.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/contract-authoring-agent-end-to-end.md)

# Citations

- [Contract Authoring Agent Procurement Policy Guide](/documents/contract-authoring-agent-policy-guide.md)
