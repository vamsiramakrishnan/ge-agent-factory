---
type: Eval Scenario
title: Run the Audit Evidence Collector workflow for the current period. Cite the re...
description: "Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "audit-evidence-collector-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-system-collection](/queries/multi-system-collection.md)

## Mechanisms to call

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

## Success rubric

Compliance & GRC Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Audit Evidence Collector Operations Runbook](/documents/audit-evidence-collector-runbook.md)
