---
type: Query Capability
title: "Publish interactive dashboard to Looker for drill-down analysis. Generate PDF..."
description: "Publish interactive dashboard to Looker for drill-down analysis. Generate PDF executive summary for board distribution."
source_id: "dashboard-report-delivery"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Publish interactive dashboard to Looker for drill-down analysis. Generate PDF executive summary for board distribution.

## Tools used

- [lookup_it_grc_dashboard_reporter_runbook](/tools/lookup-it-grc-dashboard-reporter-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Runs in

- [dashboard_report_delivery](/workflow/dashboard-report-delivery.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-grc-dashboard-reporter-end-to-end.md)

# Citations

- [IT GRC Dashboard & Reporter Operations Runbook](/documents/it-grc-dashboard-reporter-runbook.md)
