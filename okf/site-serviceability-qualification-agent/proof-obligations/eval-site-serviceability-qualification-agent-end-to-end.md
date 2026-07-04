---
type: Proof Obligation
title: "Golden eval obligation — Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-site-serviceability-qualification-agent-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [site-serviceability-qualification-agent-end-to-end](/tests/site-serviceability-qualification-agent-end-to-end.md)


## Mechanisms

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_publish](/tools/action-salesforce-communications-cloud-publish.md)

## Entities that must be referenced

- subscriber_accounts
- analytics_events
- telco_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [site-serviceability-qualification-agent-assurance-runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
