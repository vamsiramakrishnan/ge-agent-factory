---
type: Query Capability
title: "Execute the route step in Salesforce Commerce Cloud with a full audit trail, ..."
description: "Execute the route step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Digital Merchandising Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Digital Merchandising Manager.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-search-relevance-engine-end-to-end.md)

# Citations

- [Site Search Relevance Engine Retail Execution Playbook](/documents/site-search-relevance-engine-execution-playbook.md)
