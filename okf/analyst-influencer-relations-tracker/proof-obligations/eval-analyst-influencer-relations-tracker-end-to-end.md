---
type: Proof Obligation
title: "Golden eval obligation — Run the Analyst & Influencer Relations Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-analyst-influencer-relations-tracker-end-to-end"
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

# Golden eval obligation — Run the Analyst & Influencer Relations Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [analyst-influencer-relations-tracker-end-to-end](/tests/analyst-influencer-relations-tracker-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_cision_cision_records](/tools/query-cision-cision-records.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_analyst_influencer_relations_tracker_playbook](/tools/lookup-analyst-influencer-relations-tracker-playbook.md)

## Entities that must be referenced

- accounts
- cision_records
- linkedin_records
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [analyst-influencer-relations-tracker-playbook](/documents/analyst-influencer-relations-tracker-playbook.md)
