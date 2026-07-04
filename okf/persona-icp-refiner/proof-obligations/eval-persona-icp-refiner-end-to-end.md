---
type: Proof Obligation
title: "Golden eval obligation — Run the Persona & ICP Refiner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-persona-icp-refiner-end-to-end"
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

# Golden eval obligation — Run the Persona & ICP Refiner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [persona-icp-refiner-end-to-end](/tests/persona-icp-refiner-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_clearbit_clearbit_records](/tools/query-clearbit-clearbit-records.md)
- [lookup_persona_icp_refiner_playbook](/tools/lookup-persona-icp-refiner-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Entities that must be referenced

- accounts
- contacts
- 6sense_records
- clearbit_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [persona-icp-refiner-playbook](/documents/persona-icp-refiner-playbook.md)
