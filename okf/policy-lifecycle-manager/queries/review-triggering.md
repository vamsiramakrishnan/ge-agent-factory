---
type: Query Capability
title: Monitor policy review dates in ServiceNow GRC. Trigger reviews for policies a...
description: Monitor policy review dates in ServiceNow GRC. Trigger reviews for policies approaching their review deadline or affected by regulatory changes. Prioritize based on risk and compliance impact.
source_id: "review-triggering"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor policy review dates in ServiceNow GRC. Trigger reviews for policies approaching their review deadline or affected by regulatory changes. Prioritize based on risk and compliance impact.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [lookup_policy_lifecycle_manager_runbook](/tools/lookup-policy-lifecycle-manager-runbook.md)

## Runs in

- [review_triggering](/workflow/review-triggering.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-lifecycle-manager-end-to-end.md)

# Citations

- [Policy Lifecycle Manager Operations Runbook](/documents/policy-lifecycle-manager-runbook.md)
