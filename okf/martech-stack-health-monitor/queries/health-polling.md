---
type: Query Capability
title: "Check API health and data sync status across HubSpot, Salesforce, GA4, and ad..."
description: "Check API health and data sync status across HubSpot, Salesforce, GA4, and ad platforms. Detect integration failures, sync delays, and license utilization issues."
source_id: "health-polling"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Check API health and data sync status across HubSpot, Salesforce, GA4, and ad platforms. Detect integration failures, sync delays, and license utilization issues.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_martech_stack_health_monitor_playbook](/tools/lookup-martech-stack-health-monitor-playbook.md)
- [action_hubspot_log_entry](/tools/action-hubspot-log-entry.md)

## Runs in

- [health_polling](/workflow/health-polling.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/martech-stack-health-monitor-end-to-end.md)

# Citations

- [MarTech Stack Health Monitor Playbook](/documents/martech-stack-health-monitor-playbook.md)
