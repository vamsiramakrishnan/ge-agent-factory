---
type: Proof Obligation
title: "Golden eval obligation — Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-utm-tracking-governance-agent-end-to-end"
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

# Golden eval obligation — Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [utm-tracking-governance-agent-end-to-end](/tests/utm-tracking-governance-agent-end-to-end.md)


## Mechanisms

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_utm_tracking_governance_agent_playbook](/tools/lookup-utm-tracking-governance-agent-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Entities that must be referenced

- session_events
- contacts
- sheets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [utm-tracking-governance-agent-playbook](/documents/utm-tracking-governance-agent-playbook.md)
