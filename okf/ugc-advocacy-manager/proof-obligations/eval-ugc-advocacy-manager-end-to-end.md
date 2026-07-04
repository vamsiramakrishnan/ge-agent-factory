---
type: Proof Obligation
title: "Golden eval obligation — Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ugc-advocacy-manager-end-to-end"
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

# Golden eval obligation — Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ugc-advocacy-manager-end-to-end](/tests/ugc-advocacy-manager-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_ugc_advocacy_manager_playbook](/tools/lookup-ugc-advocacy-manager-playbook.md)
- [action_sprout_social_draft](/tools/action-sprout-social-draft.md)

## Entities that must be referenced

- social_posts
- contacts
- accounts
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [ugc-advocacy-manager-playbook](/documents/ugc-advocacy-manager-playbook.md)
