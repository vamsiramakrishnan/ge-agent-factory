---
type: Query Capability
title: "Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same..."
description: "Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same account_number via query_zendesk_tickets to detect open P1/P2 tickets, low satisfaction_scores, and repeat-contact spirals before suggesting a next-best troubleshooting step."
source_id: "repeat-contact-known-issue-correlation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same account_number via query_zendesk_tickets to detect open P1/P2 tickets, low satisfaction_scores, and repeat-contact spirals before suggesting a next-best troubleshooting step.

## Tools used

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)

## Runs in

- [repeat_contact_known_issue_correlation](/workflow/repeat-contact-known-issue-correlation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/care-call-resolution-copilot-agent-end-to-end.md)
- [Account 48213076 (interaction_id 612938451) just called in on a network_complaint intent and passed CPNI authentication. Zendesk shows an open P2 ticket in the network category from 6 days ago with sla_met=false, plus a satisfaction_scores entry of 2.1 logged for this account 2 days ago. The floor agent wants to mark fcr_resolved=true and close this out as a fresh, unrelated contact. Reconcile whether this qualifies as first-call resolution or a repeat-contact escalation, and cite the runbook section that governs it.](/tests/care-call-resolution-copilot-agent-repeat-contact-reconciliation.md)

# Citations

- [Care Call Resolution Copilot Agent Service Assurance Runbook](/documents/care-call-resolution-copilot-agent-assurance-runbook.md)
- [CPNI Verification & Retention Offer Authorization Policy](/documents/care-call-resolution-copilot-agent-cpni-retention-offer-policy.md)
