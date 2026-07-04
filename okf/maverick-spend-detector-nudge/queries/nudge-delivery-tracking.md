---
type: Query Capability
title: "Deliver nudge via Slack or email with one-click redirect to compliant alterna..."
description: "Deliver nudge via Slack or email with one-click redirect to compliant alternative. Track compliance rates and compile weekly maverick spend reports."
source_id: "nudge-delivery-tracking"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Deliver nudge via Slack or email with one-click redirect to compliant alternative. Track compliance rates and compile weekly maverick spend reports.

## Tools used

- [query_slack_email_messages](/tools/query-slack-email-messages.md)
- [lookup_maverick_spend_detector_nudge_policy_guide](/tools/lookup-maverick-spend-detector-nudge-policy-guide.md)

## Runs in

- [nudge_delivery_tracking](/workflow/nudge-delivery-tracking.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

# Citations

- [Maverick Spend Detector & Nudge Procurement Policy Guide](/documents/maverick-spend-detector-nudge-policy-guide.md)
