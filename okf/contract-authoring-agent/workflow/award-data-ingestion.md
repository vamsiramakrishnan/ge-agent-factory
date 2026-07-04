---
type: Workflow Stage
title: Award Data Ingestion
description: "Pull award decision data — supplier details, negotiated pricing, terms, and risk tier — from sourcing system. Select appropriate contract template from CLM based on contract type, value, and jurisdiction."
source_id: award_data_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Award Data Ingestion

Pull award decision data — supplier details, negotiated pricing, terms, and risk tier — from sourcing system. Select appropriate contract template from CLM based on contract type, value, and jurisdiction.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_contract_authoring_agent_policy_guide](/tools/lookup-contract-authoring-agent-policy-guide.md)

Next: [Template & Risk Classification](/workflow/template-risk-classification.md)
