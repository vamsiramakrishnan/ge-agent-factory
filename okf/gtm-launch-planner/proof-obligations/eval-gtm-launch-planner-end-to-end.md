---
type: Proof Obligation
title: "Golden eval obligation — Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-gtm-launch-planner-end-to-end"
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

# Golden eval obligation — Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [gtm-launch-planner-end-to-end](/tests/gtm-launch-planner-end-to-end.md)


## Mechanisms

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_gtm_launch_planner_playbook](/tools/lookup-gtm-launch-planner-playbook.md)
- [action_asana_generate](/tools/action-asana-generate.md)

## Entities that must be referenced

- asana_records
- accounts
- accounts
- contacts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [gtm-launch-planner-playbook](/documents/gtm-launch-planner-playbook.md)
