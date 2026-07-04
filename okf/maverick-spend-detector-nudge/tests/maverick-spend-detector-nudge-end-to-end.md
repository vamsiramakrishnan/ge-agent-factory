---
type: Eval Scenario
title: "Run the Maverick Spend Detector & Nudge workflow for the current period. Cite..."
description: "Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "maverick-spend-detector-nudge-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [personalized-nudge-generation](/queries/personalized-nudge-generation.md)

## Mechanisms to call

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_slack_email_messages](/tools/query-slack-email-messages.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

## Success rubric

Action generate executed against Coupa/Ariba Catalog, with audit-trail entry and P2P Operations Manager notified of outcomes.

# Citations

- [Maverick Spend Detector & Nudge Procurement Policy Guide](/documents/maverick-spend-detector-nudge-policy-guide.md)
