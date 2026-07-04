---
type: Proof Obligation
title: "Golden eval obligation — Run the Lead Nurture Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-lead-nurture-optimizer-end-to-end"
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

# Golden eval obligation — Run the Lead Nurture Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [lead-nurture-optimizer-end-to-end](/tests/lead-nurture-optimizer-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_lead_nurture_optimizer_playbook](/tools/lookup-lead-nurture-optimizer-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Entities that must be referenced

- contacts
- campaigns
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [lead-nurture-optimizer-playbook](/documents/lead-nurture-optimizer-playbook.md)
