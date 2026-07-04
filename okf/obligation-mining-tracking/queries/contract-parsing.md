---
type: Query Capability
title: "Parse executed contract into clause-level segments. Extract dates, parties, a..."
description: "Parse executed contract into clause-level segments. Extract dates, parties, and structural metadata from CLM system for downstream obligation mining."
source_id: "contract-parsing"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse executed contract into clause-level segments. Extract dates, parties, and structural metadata from CLM system for downstream obligation mining.

## Tools used

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_obligation_mining_tracking_policy_guide](/tools/lookup-obligation-mining-tracking-policy-guide.md)

## Runs in

- [contract_parsing](/workflow/contract-parsing.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/obligation-mining-tracking-end-to-end.md)

# Citations

- [Obligation Mining & Tracking Procurement Policy Guide](/documents/obligation-mining-tracking-policy-guide.md)
