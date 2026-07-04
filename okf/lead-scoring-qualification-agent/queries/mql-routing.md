---
type: Query Capability
title: Update lead scores in CRM. Trigger MQL notifications to assigned SDRs with qu...
description: Update lead scores in CRM. Trigger MQL notifications to assigned SDRs with qualification narrative and recommended outreach approach.
source_id: "mql-routing"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Update lead scores in CRM. Trigger MQL notifications to assigned SDRs with qualification narrative and recommended outreach approach.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_lead_scoring_qualification_agent_playbook](/tools/lookup-lead-scoring-qualification-agent-playbook.md)

## Runs in

- [mql_routing](/workflow/mql-routing.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-scoring-qualification-agent-end-to-end.md)

# Citations

- [Lead Scoring & Qualification Agent Playbook](/documents/lead-scoring-qualification-agent-playbook.md)
