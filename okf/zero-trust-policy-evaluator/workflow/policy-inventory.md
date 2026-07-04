---
type: Workflow Stage
title: Policy Inventory
description: "Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma (network segmentation), and BeyondCorp (device trust). Map policies to applications and data assets."
source_id: policy_inventory
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Policy Inventory

Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma (network segmentation), and BeyondCorp (device trust). Map policies to applications and data assets.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_okta_users](/tools/query-okta-users.md)
- [query_palo_alto_prisma_palo_alto_prisma_records](/tools/query-palo-alto-prisma-palo-alto-prisma-records.md)
- [query_google_beyondcorp_google_beyondcorp_records](/tools/query-google-beyondcorp-google-beyondcorp-records.md)
- [lookup_zero_trust_policy_evaluator_runbook](/tools/lookup-zero-trust-policy-evaluator-runbook.md)

Next: [Zero Trust Gap Analysis](/workflow/zero-trust-gap-analysis.md)
