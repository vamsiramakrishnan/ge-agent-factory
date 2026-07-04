---
type: Workflow Stage
title: "Off-Contract Detection"
description: "Monitor PO creation events in real time. Compare each PO against contract and catalog coverage to identify non-catalog or off-contract purchases."
source_id: off_contract_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Off-Contract Detection

Monitor PO creation events in real time. Compare each PO against contract and catalog coverage to identify non-catalog or off-contract purchases.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

Next: [Root Cause Classification](/workflow/root-cause-classification.md)
