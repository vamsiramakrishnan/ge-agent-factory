---
type: Query Capability
title: "LLM generates context-aware nudge messages addressing the specific reason for..."
description: "LLM generates context-aware nudge messages addressing the specific reason for maverick behavior. 'You ordered cartridges from Office Supply Co. at $45/unit — same cartridge available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' vs. 'No catalog option for CNC machining — would you like to request one from your Category Manager?'"
source_id: "personalized-nudge-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM generates context-aware nudge messages addressing the specific reason for maverick behavior. 'You ordered cartridges from Office Supply Co. at $45/unit — same cartridge available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' vs. 'No catalog option for CNC machining — would you like to request one from your Category Manager?'

## Tools used

- [query_coupa_ariba_catalog_requisitions](/tools/query-coupa-ariba-catalog-requisitions.md)
- [query_slack_email_messages](/tools/query-slack-email-messages.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)
- [action_coupa_ariba_catalog_generate](/tools/action-coupa-ariba-catalog-generate.md)

## Runs in

- [personalized_nudge_generation](/workflow/personalized-nudge-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

# Citations

- [Maverick Spend Detector & Nudge Procurement Policy Guide](/documents/maverick-spend-detector-nudge-policy-guide.md)
