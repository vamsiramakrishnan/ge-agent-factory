---
type: Eval Scenario
title: "Multi-site qualification request for subscriber account 3124589901: the BigQu..."
description: "Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?"
source_id: "site-serviceability-qualification-agent-stale-evidence-near-net-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?

## Validates

- [near-net-lateral-build-cost-interval-scoring](/queries/near-net-lateral-build-cost-interval-scoring.md)

## Mechanisms to call

- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Near-Net Lateral Build-Cost & Serviceability Determination Rate Manual](/documents/site-serviceability-near-net-build-cost-rate-manual.md)
- [Site Serviceability Qualification Agent Service Assurance Runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
