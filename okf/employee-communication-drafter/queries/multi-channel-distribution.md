---
type: Query Capability
title: "Schedule and distribute communications across email, Slack, and intranet. Tra..."
description: "Schedule and distribute communications across email, Slack, and intranet. Track delivery and initial engagement metrics."
source_id: "multi-channel-distribution"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Schedule and distribute communications across email, Slack, and intranet. Track delivery and initial engagement metrics.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [lookup_employee_communication_drafter_policy_handbook](/tools/lookup-employee-communication-drafter-policy-handbook.md)

## Runs in

- [multi_channel_distribution](/workflow/multi-channel-distribution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-communication-drafter-end-to-end.md)

# Citations

- [Employee Communication Drafter Policy Handbook](/documents/employee-communication-drafter-policy-handbook.md)
