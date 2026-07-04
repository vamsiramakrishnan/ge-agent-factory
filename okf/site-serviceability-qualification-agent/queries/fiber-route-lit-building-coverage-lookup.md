---
type: Query Capability
title: Query the network facilities inventory system (TELCO 3) with query_telco_3_te...
description: "Query the network facilities inventory system (TELCO 3) with query_telco_3_telco_3_records to determine on-net lit-building status, fiber route proximity, and fixed-wireless coverage footprint for each address matched against telco_3_records."
source_id: "fiber-route-lit-building-coverage-lookup"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query the network facilities inventory system (TELCO 3) with query_telco_3_telco_3_records to determine on-net lit-building status, fiber route proximity, and fixed-wireless coverage footprint for each address matched against telco_3_records.

## Tools used

- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)

## Runs in

- [fiber_route_lit_building_coverage_lookup](/workflow/fiber-route-lit-building-coverage-lookup.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-serviceability-qualification-agent-end-to-end.md)
- [Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date.](/tests/site-serviceability-qualification-agent-conflicting-serviceability-flag.md)
- [Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?](/tests/site-serviceability-qualification-agent-stale-evidence-near-net-edge.md)

# Citations

- [Site Serviceability Qualification Agent Service Assurance Runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
- [Near-Net Lateral Build-Cost & Serviceability Determination Rate Manual](/documents/site-serviceability-near-net-build-cost-rate-manual.md)
