---
type: Query Capability
title: "Retrieve past contract terms, pricing history, and concession patterns from I..."
description: "Retrieve past contract terms, pricing history, and concession patterns from Icertis and DocuSign CLM. Pull current market benchmarks and supplier financial performance data. Compile supplier performance scorecards."
source_id: "contract-market-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Retrieve past contract terms, pricing history, and concession patterns from Icertis and DocuSign CLM. Pull current market benchmarks and supplier financial performance data. Compile supplier performance scorecards.

## Tools used

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_market_intel_market_intel_records](/tools/query-market-intel-market-intel-records.md)
- [lookup_negotiation_prep_agent_policy_guide](/tools/lookup-negotiation-prep-agent-policy-guide.md)
- [action_icertis_generate](/tools/action-icertis-generate.md)

## Runs in

- [contract_market_assembly](/workflow/contract-market-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/negotiation-prep-agent-end-to-end.md)

# Citations

- [Negotiation Prep Agent Procurement Policy Guide](/documents/negotiation-prep-agent-policy-guide.md)
