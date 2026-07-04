---
type: Workflow Stage
title: "Multi-System Collection"
description: "Auto-collect evidence from mapped sources: change tickets from Jira, policy documents from Google Drive, approval threads from Slack, incident records from ServiceNow. Validate freshness and completeness."
source_id: multi_system_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-System Collection

Auto-collect evidence from mapped sources: change tickets from Jira, policy documents from Google Drive, approval threads from Slack, incident records from ServiceNow. Validate freshness and completeness.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

Next: [Gap Analysis](/workflow/gap-analysis.md)
