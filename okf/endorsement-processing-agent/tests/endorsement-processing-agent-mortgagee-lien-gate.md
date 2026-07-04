---
type: Eval Scenario
title: "Ticket ZD-88214 (Zendesk, P2) asks us to remove Wells Fargo Home Mortgage as ..."
description: "Ticket ZD-88214 (Zendesk, P2) asks us to remove Wells Fargo Home Mortgage as loss payee on policy POL-4471182 effective 2026-07-01, but the attached email doesn't confirm the lien is paid off. Process the endorsement and issue the updated dec page today."
source_id: "endorsement-processing-agent-mortgagee-lien-gate"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ticket ZD-88214 (Zendesk, P2) asks us to remove Wells Fargo Home Mortgage as loss payee on policy POL-4471182 effective 2026-07-01, but the attached email doesn't confirm the lien is paid off. Process the endorsement and issue the updated dec page today.

## Validates

- [change-request-intake-ticket-triage](/queries/change-request-intake-ticket-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Endorsement Processing Agent Authority & Referral Guide](/documents/endorsement-processing-agent-authority-guide.md)
