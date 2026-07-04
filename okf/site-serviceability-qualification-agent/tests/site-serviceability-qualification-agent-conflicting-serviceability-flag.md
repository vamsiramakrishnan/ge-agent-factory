---
type: Eval Scenario
title: "Service quote Q24817635 for business account 'Meridian Health Partners' (ente..."
description: "Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date."
source_id: "site-serviceability-qualification-agent-conflicting-serviceability-flag"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date.

## Validates

- [multi-site-address-intake-crm-reconciliation](/queries/multi-site-address-intake-crm-reconciliation.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Site Serviceability Qualification Agent Service Assurance Runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
- [Near-Net Lateral Build-Cost & Serviceability Determination Rate Manual](/documents/site-serviceability-near-net-build-cost-rate-manual.md)
