---
type: Workflow Stage
title: Health Polling
description: "Check API health and data sync status across HubSpot, Salesforce, GA4, and ad platforms. Detect integration failures, sync delays, and license utilization issues."
source_id: health_polling
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Health Polling

Check API health and data sync status across HubSpot, Salesforce, GA4, and ad platforms. Detect integration failures, sync delays, and license utilization issues.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_martech_stack_health_monitor_playbook](/tools/lookup-martech-stack-health-monitor-playbook.md)
- [action_hubspot_log_entry](/tools/action-hubspot-log-entry.md)

Next: [Root Cause Diagnosis](/workflow/root-cause-diagnosis.md)
