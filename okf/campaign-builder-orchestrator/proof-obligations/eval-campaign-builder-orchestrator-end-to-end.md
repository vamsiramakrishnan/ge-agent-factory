---
type: Proof Obligation
title: "Golden eval obligation — Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-campaign-builder-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [campaign-builder-orchestrator-end-to-end](/tests/campaign-builder-orchestrator-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_campaign_builder_orchestrator_playbook](/tools/lookup-campaign-builder-orchestrator-playbook.md)
- [action_hubspot_draft](/tools/action-hubspot-draft.md)

## Entities that must be referenced

- contacts
- campaigns
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [campaign-builder-orchestrator-playbook](/documents/campaign-builder-orchestrator-playbook.md)
