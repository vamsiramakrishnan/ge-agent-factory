---
type: Workflow Stage
title: PO Execution
description: "Selected supplier quote converted to purchase order in Coupa. Full audit trail of benchmark, quotes received, and negotiation history preserved for compliance."
source_id: po_execution
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# PO Execution

Selected supplier quote converted to purchase order in Coupa. Full audit trail of benchmark, quotes received, and negotiation history preserved for compliance.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)
