---
type: Query Capability
title: Sync target account lists from Demandbase/6sense. Research accounts using pub...
description: "Sync target account lists from Demandbase/6sense. Research accounts using publicly available information \\u2014 annual reports, press releases, leadership changes, technology stack."
source_id: "account-intelligence"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync target account lists from Demandbase/6sense. Research accounts using publicly available information \u2014 annual reports, press releases, leadership changes, technology stack.

## Tools used

- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [action_demandbase_generate](/tools/action-demandbase-generate.md)

## Runs in

- [account_intelligence](/workflow/account-intelligence.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/abm-campaign-manager-end-to-end.md)

# Citations

- [ABM Campaign Manager Playbook](/documents/abm-campaign-manager-playbook.md)
