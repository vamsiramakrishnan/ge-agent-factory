---
type: Query Capability
title: Execute the publish step in Salesforce Commerce Cloud with a full audit trail...
description: "Execute the publish step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the E-Commerce Merchandiser."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the E-Commerce Merchandiser.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)
