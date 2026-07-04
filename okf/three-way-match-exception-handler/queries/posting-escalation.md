---
type: Query Capability
title: "Auto-post matched invoices. Route above-threshold exceptions with resolution ..."
description: "Auto-post matched invoices. Route above-threshold exceptions with resolution recommendations and supporting evidence to AP Manager for review."
source_id: "posting-escalation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-post matched invoices. Route above-threshold exceptions with resolution recommendations and supporting evidence to AP Manager for review.

## Tools used

- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)
- [action_sap_s_4hana_miro_mir7_recommend](/tools/action-sap-s-4hana-miro-mir7-recommend.md)

## Runs in

- [posting_escalation](/workflow/posting-escalation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

# Citations

- [Three-Way Match Exception Handler Procurement Policy Guide](/documents/three-way-match-exception-handler-policy-guide.md)
