---
type: Proof Obligation
title: "Golden eval obligation — Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-lead-routing-assignment-engine-end-to-end"
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

# Golden eval obligation — Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [lead-routing-assignment-engine-end-to-end](/tests/lead-routing-assignment-engine-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_leandata_leandata_records](/tools/query-leandata-leandata-records.md)
- [lookup_lead_routing_assignment_engine_playbook](/tools/lookup-lead-routing-assignment-engine-playbook.md)
- [action_salesforce_crm_assign](/tools/action-salesforce-crm-assign.md)

## Entities that must be referenced

- accounts
- contacts
- leandata_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute assign without two-system evidence

# Citations

- [lead-routing-assignment-engine-playbook](/documents/lead-routing-assignment-engine-playbook.md)
