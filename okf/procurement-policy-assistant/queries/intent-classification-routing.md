---
type: Query Capability
title: "Classify query intent to route between policy domains — sourcing thresholds, ..."
description: "Classify query intent to route between policy domains — sourcing thresholds, travel policy, contract authority, expense limits. Minimal ML; primarily keyword and embedding similarity."
source_id: "intent-classification-routing"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify query intent to route between policy domains — sourcing thresholds, travel policy, contract authority, expense limits. Minimal ML; primarily keyword and embedding similarity.

## Tools used

- [lookup_procurement_policy_assistant_policy_guide](/tools/lookup-procurement-policy-assistant-policy-guide.md)
- [action_sharepoint_google_drive_route](/tools/action-sharepoint-google-drive-route.md)

## Runs in

- [intent_classification_routing](/workflow/intent-classification-routing.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-policy-assistant-end-to-end.md)

# Citations

- [Procurement Policy Assistant Procurement Policy Guide](/documents/procurement-policy-assistant-policy-guide.md)
