---
type: Query Capability
title: Contextual reminders via Slack and email with escalation to managers of manag...
description: "Contextual reminders via Slack and email with escalation to managers of managers. Sign-off collection, appeals processing, and cycle archival."
source_id: "smart-nudges-closure"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual reminders via Slack and email with escalation to managers of managers. Sign-off collection, appeals processing, and cycle archival.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_review_cycle_orchestration_agent_policy_handbook](/tools/lookup-review-cycle-orchestration-agent-policy-handbook.md)

## Runs in

- [smart_nudges_closure](/workflow/smart-nudges-closure.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/review-cycle-orchestration-agent-end-to-end.md)

# Citations

- [Review Cycle Orchestration Agent Policy Handbook](/documents/review-cycle-orchestration-agent-policy-handbook.md)
