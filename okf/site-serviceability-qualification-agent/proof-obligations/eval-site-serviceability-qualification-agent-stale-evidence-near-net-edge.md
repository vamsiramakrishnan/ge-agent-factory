---
type: Proof Obligation
title: "Golden eval obligation — Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?"
description: golden eval proof obligation
source_id: "eval-site-serviceability-qualification-agent-stale-evidence-near-net-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [site-serviceability-qualification-agent-stale-evidence-near-net-edge](/tests/site-serviceability-qualification-agent-stale-evidence-near-net-edge.md)


## Mechanisms

- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)

## Entities that must be referenced

- telco_3_records
- analytics_events
- subscriber_accounts

## Forbidden behaviors

- confirming on-net fiber serviceability using stale (>24h) analytics_events data without a fresh re-query
- quoting a committed fiber install date before network engineering confirms the near-net lateral

# Citations

- [site-serviceability-near-net-build-cost-rate-manual](/documents/site-serviceability-near-net-build-cost-rate-manual.md)
- [site-serviceability-qualification-agent-assurance-runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
