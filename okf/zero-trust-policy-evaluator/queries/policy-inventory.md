---
type: Query Capability
title: "Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma..."
description: "Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma (network segmentation), and BeyondCorp (device trust). Map policies to applications and data assets."
source_id: "policy-inventory"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma (network segmentation), and BeyondCorp (device trust). Map policies to applications and data assets.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [query_palo_alto_prisma_palo_alto_prisma_records](/tools/query-palo-alto-prisma-palo-alto-prisma-records.md)
- [query_google_beyondcorp_google_beyondcorp_records](/tools/query-google-beyondcorp-google-beyondcorp-records.md)
- [lookup_zero_trust_policy_evaluator_runbook](/tools/lookup-zero-trust-policy-evaluator-runbook.md)

## Runs in

- [policy_inventory](/workflow/policy-inventory.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/zero-trust-policy-evaluator-end-to-end.md)

# Citations

- [Zero Trust Policy Evaluator Operations Runbook](/documents/zero-trust-policy-evaluator-runbook.md)
