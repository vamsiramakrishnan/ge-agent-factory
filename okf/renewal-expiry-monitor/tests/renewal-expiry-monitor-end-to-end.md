---
type: Eval Scenario
title: "Run the Renewal & Expiry Monitor workflow for the current period. Cite the re..."
description: "Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "renewal-expiry-monitor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [performance-market-scoring](/queries/performance-market-scoring.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_sap_ariba_contracts_suppliers](/tools/query-sap-ariba-contracts-suppliers.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_renewal_expiry_monitor_policy_guide](/tools/lookup-renewal-expiry-monitor-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Success rubric

Action recommend executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Renewal & Expiry Monitor Procurement Policy Guide](/documents/renewal-expiry-monitor-policy-guide.md)
