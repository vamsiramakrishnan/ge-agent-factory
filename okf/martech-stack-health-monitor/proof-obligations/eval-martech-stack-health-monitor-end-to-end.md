---
type: Proof Obligation
title: "Golden eval obligation — Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-martech-stack-health-monitor-end-to-end"
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

# Golden eval obligation — Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [martech-stack-health-monitor-end-to-end](/tests/martech-stack-health-monitor-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_martech_stack_health_monitor_playbook](/tools/lookup-martech-stack-health-monitor-playbook.md)
- [action_hubspot_log_entry](/tools/action-hubspot-log-entry.md)

## Entities that must be referenced

- contacts
- accounts
- session_events
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute log entry without two-system evidence

# Citations

- [martech-stack-health-monitor-playbook](/documents/martech-stack-health-monitor-playbook.md)
