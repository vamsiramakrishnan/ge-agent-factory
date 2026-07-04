---
type: Workflow Stage
title: "Classification & Duplicate Detection"
description: "Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests."
source_id: classification_duplicate_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classification & Duplicate Detection

Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)
- [action_sap_s_4hana_mm_me51n_match](/tools/action-sap-s-4hana-mm-me51n-match.md)

Next: [Intent Resolution & Enrichment](/workflow/intent-resolution-enrichment.md)
