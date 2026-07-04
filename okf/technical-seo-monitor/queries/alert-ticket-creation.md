---
type: Query Capability
title: Critical issues alert via Slack immediately. All issues logged with prioritiz...
description: Critical issues alert via Slack immediately. All issues logged with prioritized fix steps. Trend dashboards updated for ongoing monitoring.
source_id: "alert-ticket-creation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Critical issues alert via Slack immediately. All issues logged with prioritized fix steps. Trend dashboards updated for ongoing monitoring.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_technical_seo_monitor_playbook](/tools/lookup-technical-seo-monitor-playbook.md)

## Runs in

- [alert_ticket_creation](/workflow/alert-ticket-creation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technical-seo-monitor-end-to-end.md)

# Citations

- [Technical SEO Monitor Playbook](/documents/technical-seo-monitor-playbook.md)
