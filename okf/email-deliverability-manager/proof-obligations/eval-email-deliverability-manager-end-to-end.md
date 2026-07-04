---
type: Proof Obligation
title: "Golden eval obligation — Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-email-deliverability-manager-end-to-end"
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

# Golden eval obligation — Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [email-deliverability-manager-end-to-end](/tests/email-deliverability-manager-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_google_postmaster_google_postmaster_records](/tools/query-google-postmaster-google-postmaster-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

## Entities that must be referenced

- contacts
- campaigns
- google_postmaster_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute send without two-system evidence

# Citations

- [email-deliverability-manager-playbook](/documents/email-deliverability-manager-playbook.md)
