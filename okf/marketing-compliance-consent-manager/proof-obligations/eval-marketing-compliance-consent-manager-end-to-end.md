---
type: Proof Obligation
title: "Golden eval obligation — Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-marketing-compliance-consent-manager-end-to-end"
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

# Golden eval obligation — Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [marketing-compliance-consent-manager-end-to-end](/tests/marketing-compliance-consent-manager-end-to-end.md)


## Mechanisms

- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

## Entities that must be referenced

- onetrust_records
- contacts
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute sync without two-system evidence

# Citations

- [marketing-compliance-consent-manager-playbook](/documents/marketing-compliance-consent-manager-playbook.md)
