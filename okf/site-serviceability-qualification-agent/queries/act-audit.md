---
type: Query Capability
title: Execute the publish step in Salesforce Communications Cloud with a full audit...
description: "Execute the publish step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Sales Solution Consultant."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Sales Solution Consultant.

## Tools used

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [action_salesforce_communications_cloud_publish](/tools/action-salesforce-communications-cloud-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-serviceability-qualification-agent-end-to-end.md)

# Citations

- [Site Serviceability Qualification Agent Service Assurance Runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
