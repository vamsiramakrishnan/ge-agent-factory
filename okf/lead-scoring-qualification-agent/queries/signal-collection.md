---
type: Query Capability
title: Receive behavioral events from MAP. Enrich with firmographic data from 6sense...
description: Receive behavioral events from MAP. Enrich with firmographic data from 6sense/Demandbase. Match to CRM records with account hierarchy resolution.
source_id: "signal-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive behavioral events from MAP. Enrich with firmographic data from 6sense/Demandbase. Match to CRM records with account hierarchy resolution.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)

## Runs in

- [signal_collection](/workflow/signal-collection.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-scoring-qualification-agent-end-to-end.md)

# Citations

- [Lead Scoring & Qualification Agent Playbook](/documents/lead-scoring-qualification-agent-playbook.md)
