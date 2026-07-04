---
type: Workflow Stage
title: Profile Download Triage
description: "Pull provisioning_tasks and run query_splunk_log_events against Splunk to spot SM-DP+ profile downloads stuck on hlr_hss_update or number_activation task_type, keying on retry_count and error_code."
source_id: profile_download_triage
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Profile Download Triage

Pull provisioning_tasks and run query_splunk_log_events against Splunk to spot SM-DP+ profile downloads stuck on hlr_hss_update or number_activation task_type, keying on retry_count and error_code.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

Next: [Cross-System State Reconciliation](/workflow/cross-system-state-reconciliation.md)
