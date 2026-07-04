---
type: Query Capability
title: "Auto-collect evidence from mapped sources: change tickets from Jira, policy d..."
description: "Auto-collect evidence from mapped sources: change tickets from Jira, policy documents from Google Drive, approval threads from Slack, incident records from ServiceNow. Validate freshness and completeness."
source_id: "multi-system-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-collect evidence from mapped sources: change tickets from Jira, policy documents from Google Drive, approval threads from Slack, incident records from ServiceNow. Validate freshness and completeness.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

## Runs in

- [multi_system_collection](/workflow/multi-system-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-evidence-collector-end-to-end.md)

# Citations

- [Audit Evidence Collector Operations Runbook](/documents/audit-evidence-collector-runbook.md)
