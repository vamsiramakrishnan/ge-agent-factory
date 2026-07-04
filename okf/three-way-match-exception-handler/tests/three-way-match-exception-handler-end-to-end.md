---
type: Eval Scenario
title: "Run the Three-Way Match Exception Handler workflow for the current period. Ci..."
description: "Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "three-way-match-exception-handler-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [exception-reasoning](/queries/exception-reasoning.md)

## Mechanisms to call

- [query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_records](/tools/query-sap-s-4hana-miro-mir7-sap-s-4hana-miro-mir7-records.md)
- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [query_basware_basware_records](/tools/query-basware-basware-records.md)
- [query_kofax_kofax_records](/tools/query-kofax-kofax-records.md)
- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)
- [action_sap_s_4hana_miro_mir7_recommend](/tools/action-sap-s-4hana-miro-mir7-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA (MIRO/MIR7), with audit-trail entry and AP Manager notified of outcomes.

# Citations

- [Three-Way Match Exception Handler Procurement Policy Guide](/documents/three-way-match-exception-handler-policy-guide.md)
