---
type: Query Capability
title: Selected supplier quote converted to purchase order in Coupa. Full audit trai...
description: "Selected supplier quote converted to purchase order in Coupa. Full audit trail of benchmark, quotes received, and negotiation history preserved for compliance."
source_id: "po-execution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Selected supplier quote converted to purchase order in Coupa. Full audit trail of benchmark, quotes received, and negotiation history preserved for compliance.

## Tools used

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)

## Runs in

- [po_execution](/workflow/po-execution.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spot-buy-negotiation-agent-end-to-end.md)

# Citations

- [Spot Buy Negotiation Agent Procurement Policy Guide](/documents/spot-buy-negotiation-agent-policy-guide.md)
