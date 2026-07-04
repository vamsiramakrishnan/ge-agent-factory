---
type: Query Capability
title: ML classification of spend suitability by channel — strategic sourcing vs. ca...
description: "ML classification of spend suitability by channel — strategic sourcing vs. catalog vs. spot buy vs. P-card — based on value, frequency, complexity, and supplier count. Identify migration candidates."
source_id: "channel-classification"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML classification of spend suitability by channel — strategic sourcing vs. catalog vs. spot buy vs. P-card — based on value, frequency, complexity, and supplier count. Identify migration candidates.

## Tools used

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [lookup_sourcing_channel_optimizer_policy_guide](/tools/lookup-sourcing-channel-optimizer-policy-guide.md)
- [action_coupa_catalog_generate](/tools/action-coupa-catalog-generate.md)

## Runs in

- [channel_classification](/workflow/channel-classification.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sourcing-channel-optimizer-end-to-end.md)

# Citations

- [Sourcing Channel Optimizer Procurement Policy Guide](/documents/sourcing-channel-optimizer-policy-guide.md)
