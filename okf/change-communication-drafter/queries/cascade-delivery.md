---
type: Query Capability
title: "Scheduled distribution of approved communications across Google Docs, Slack, ..."
description: "Scheduled distribution of approved communications across Google Docs, Slack, and email channels with acknowledgment tracking."
source_id: "cascade-delivery"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scheduled distribution of approved communications across Google Docs, Slack, and email channels with acknowledgment tracking.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_change_communication_drafter_policy_handbook](/tools/lookup-change-communication-drafter-policy-handbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Runs in

- [cascade_delivery](/workflow/cascade-delivery.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-communication-drafter-end-to-end.md)

# Citations

- [Change Communication Drafter Policy Handbook](/documents/change-communication-drafter-policy-handbook.md)
