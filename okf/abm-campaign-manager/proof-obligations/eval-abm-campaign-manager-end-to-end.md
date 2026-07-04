---
type: Proof Obligation
title: "Golden eval obligation — Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-abm-campaign-manager-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [abm-campaign-manager-end-to-end](/tests/abm-campaign-manager-end-to-end.md)


## Mechanisms

- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_abm_campaign_manager_playbook](/tools/lookup-abm-campaign-manager-playbook.md)
- [action_demandbase_generate](/tools/action-demandbase-generate.md)

## Entities that must be referenced

- demandbase_records
- 6sense_records
- accounts
- contacts
- campaigns

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [abm-campaign-manager-playbook](/documents/abm-campaign-manager-playbook.md)
