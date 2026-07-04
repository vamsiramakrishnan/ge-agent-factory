---
type: Eval Scenario
title: "Account 55810042's billing case in tickets has had 3 contacts in the last 6 d..."
description: "Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action."
source_id: "nps-detractor-recovery-agent-repeat-contact-offer-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action.

## Validates

- [detractor-verbatim-triage](/queries/detractor-verbatim-triage.md)

## Mechanisms to call

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [NPS Detractor Recovery Agent Service Assurance Runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)
- [Retention Save-Offer Authorization Matrix](/documents/nps-detractor-recovery-agent-retention-offer-authorization-matrix.md)
