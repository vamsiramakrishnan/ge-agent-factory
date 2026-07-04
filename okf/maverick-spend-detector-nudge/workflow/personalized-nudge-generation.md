---
type: Workflow Stage
title: Personalized Nudge Generation
description: "LLM generates context-aware nudge messages addressing the specific reason for maverick behavior. 'You ordered cartridges from Office Supply Co. at $45/unit — same cartridge available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' vs. 'No catalog option for CNC machining — would you like to request one from your Category Manager?'"
source_id: personalized_nudge_generation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Personalized Nudge Generation

LLM generates context-aware nudge messages addressing the specific reason for maverick behavior. 'You ordered cartridges from Office Supply Co. at $45/unit — same cartridge available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' vs. 'No catalog option for CNC machining — would you like to request one from your Category Manager?'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [query_slack_email_messages](/tools/query-slack-email-messages.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

Next: [Nudge Delivery & Tracking](/workflow/nudge-delivery-tracking.md)
