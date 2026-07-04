---
type: Query Capability
title: "Execute the file step in Salesforce Commerce Cloud with a full audit trail, a..."
description: "Execute the file step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Fraud Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Fraud Analyst.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Returns Abuse Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/returns-abuse-analyzer-end-to-end.md)

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
