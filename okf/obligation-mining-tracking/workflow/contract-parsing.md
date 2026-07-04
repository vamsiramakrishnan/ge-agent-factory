---
type: Workflow Stage
title: Contract Parsing
description: "Parse executed contract into clause-level segments. Extract dates, parties, and structural metadata from CLM system for downstream obligation mining."
source_id: contract_parsing
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contract Parsing

Parse executed contract into clause-level segments. Extract dates, parties, and structural metadata from CLM system for downstream obligation mining.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_obligation_mining_tracking_policy_guide](/tools/lookup-obligation-mining-tracking-policy-guide.md)

Next: [Obligation Reasoning](/workflow/obligation-reasoning.md)
