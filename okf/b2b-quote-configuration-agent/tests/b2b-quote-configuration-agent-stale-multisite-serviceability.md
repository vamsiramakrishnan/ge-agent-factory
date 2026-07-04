---
type: Eval Scenario
title: "Quote #20456218 for 'Anchor Point Manufacturing' is an enterprise_dia_100m bu..."
description: "Quote #20456218 for 'Anchor Point Manufacturing' is an enterprise_dia_100m bundle across three sites. valid_until was 2026-06-20 and serviceability_confirmed was last recorded true on 2026-05-01. The customer wants to sign today, 2026-07-04, at the original quoted price. Reconcile and issue the order capture."
source_id: "b2b-quote-configuration-agent-stale-multisite-serviceability"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quote #20456218 for 'Anchor Point Manufacturing' is an enterprise_dia_100m bundle across three sites. valid_until was 2026-06-20 and serviceability_confirmed was last recorded true on 2026-05-01. The customer wants to sign today, 2026-07-04, at the original quoted price. Reconcile and issue the order capture.

## Validates

- [opportunity-site-intake](/queries/opportunity-site-intake.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [B2B Quote Configuration Agent Service Assurance Runbook](/documents/b2b-quote-configuration-agent-assurance-runbook.md)
- [B2B Rate Card & Discount Authority Matrix](/documents/b2b-quote-configuration-agent-rate-discount-manual.md)
