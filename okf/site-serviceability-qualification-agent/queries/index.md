---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the submitted address list along with subscriber_accounts and service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts, and resolve fuzzy address matches against prior order_captures history before any coverage lookup begins.](/queries/multi-site-address-intake-crm-reconciliation.md)
- [Query the network facilities inventory system (TELCO 3) with query_telco_3_telco_3_records to determine on-net lit-building status, fiber route proximity, and fixed-wireless coverage footprint for each address matched against telco_3_records.](/queries/fiber-route-lit-building-coverage-lookup.md)
- [Compare each near-net address against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to estimate lateral build cost, standard vs non-standard construction interval, and recommended access technology (fiber_1gig, fiber_300m, fixed_wireless_access).](/queries/near-net-lateral-build-cost-interval-scoring.md)
- [Cite the Site Serviceability Qualification Agent Service Assurance Runbook and the Near-Net Lateral Build-Cost Rate Manual via lookup_site_serviceability_qualification_agent_assurance_runbook before issuing any serviceability determination or access-technology recommendation.](/queries/evidence-validation-against-the-assurance-runbook-and-rate-manual.md)
- [Execute action_salesforce_communications_cloud_publish to post the color-coded per-site serviceability matrix and recommended access technology back to the Salesforce Communications Cloud opportunity, with a full audit trail, and escalate exceptions to the Sales Solution Consultant or network engineering.](/queries/serviceability-matrix-publish-opportunity-handoff.md)
