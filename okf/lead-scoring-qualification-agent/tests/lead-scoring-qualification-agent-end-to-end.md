---
type: Eval Scenario
title: "Run the Lead Scoring & Qualification Agent workflow for the current period. C..."
description: "Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "lead-scoring-qualification-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-collection](/queries/signal-collection.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)
- [lookup_lead_scoring_qualification_agent_playbook](/tools/lookup-lead-scoring-qualification-agent-playbook.md)
- [action_hubspot_post](/tools/action-hubspot-post.md)

## Success rubric

Action post executed against HubSpot, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [Lead Scoring & Qualification Agent Playbook](/documents/lead-scoring-qualification-agent-playbook.md)
