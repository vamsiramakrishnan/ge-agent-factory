---
type: Eval Scenario
title: Run the Payment Optimization Agent workflow for the current period. Cite the ...
description: "Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "payment-optimization-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [payment-proposal-extraction](/queries/payment-proposal-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_f110_gl_entries](/tools/query-sap-s-4hana-fi-f110-gl-entries.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [query_treasury_systems_treasury_systems_records](/tools/query-treasury-systems-treasury-systems-records.md)
- [lookup_payment_optimization_agent_policy_guide](/tools/lookup-payment-optimization-agent-policy-guide.md)
- [action_sap_s_4hana_fi_f110_generate](/tools/action-sap-s-4hana-fi-f110-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI (F110), with audit-trail entry and Treasury notified of outcomes.

# Citations

- [Payment Optimization Agent Procurement Policy Guide](/documents/payment-optimization-agent-policy-guide.md)
