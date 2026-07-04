---
type: Eval Scenario
title: Run the Contract Authoring Agent workflow for the current period. Cite the re...
description: "Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "contract-authoring-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [award-data-ingestion](/queries/award-data-ingestion.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_agiloft_agiloft_records](/tools/query-agiloft-agiloft-records.md)
- [query_sap_ariba_contracts_suppliers](/tools/query-sap-ariba-contracts-suppliers.md)
- [lookup_contract_authoring_agent_policy_guide](/tools/lookup-contract-authoring-agent-policy-guide.md)
- [action_icertis_generate](/tools/action-icertis-generate.md)

## Success rubric

Action generate executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Contract Authoring Agent Procurement Policy Guide](/documents/contract-authoring-agent-policy-guide.md)
