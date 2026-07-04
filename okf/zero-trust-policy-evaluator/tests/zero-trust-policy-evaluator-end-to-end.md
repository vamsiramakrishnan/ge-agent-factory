---
type: Eval Scenario
title: Run the Zero Trust Policy Evaluator workflow for the current period. Cite the...
description: "Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "zero-trust-policy-evaluator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [policy-inventory](/queries/policy-inventory.md)

## Mechanisms to call

- [query_okta_users](/tools/query-okta-users.md)
- [query_palo_alto_prisma_palo_alto_prisma_records](/tools/query-palo-alto-prisma-palo-alto-prisma-records.md)
- [query_google_beyondcorp_google_beyondcorp_records](/tools/query-google-beyondcorp-google-beyondcorp-records.md)
- [lookup_zero_trust_policy_evaluator_runbook](/tools/lookup-zero-trust-policy-evaluator-runbook.md)

## Success rubric

CISO / Security Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Zero Trust Policy Evaluator Operations Runbook](/documents/zero-trust-policy-evaluator-runbook.md)
