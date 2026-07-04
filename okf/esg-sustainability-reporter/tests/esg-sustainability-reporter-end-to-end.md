---
type: Eval Scenario
title: "Run the ESG & Sustainability Reporter workflow for the current period. Cite t..."
description: "Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "esg-sustainability-reporter-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [report-assembly](/queries/report-assembly.md)

## Mechanisms to call

- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [query_cdp_cdp_records](/tools/query-cdp-cdp-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_esg_sustainability_reporter_controls_playbook](/tools/lookup-esg-sustainability-reporter-controls-playbook.md)
- [action_workiva_draft](/tools/action-workiva-draft.md)

## Success rubric

Action draft executed against Workiva, with audit-trail entry and CFO notified of outcomes.

# Citations

- [ESG & Sustainability Reporter Controls Playbook](/documents/esg-sustainability-reporter-controls-playbook.md)
