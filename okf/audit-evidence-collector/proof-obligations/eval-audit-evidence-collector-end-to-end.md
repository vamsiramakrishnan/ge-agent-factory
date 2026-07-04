---
type: Proof Obligation
title: "Golden eval obligation — Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-audit-evidence-collector-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [audit-evidence-collector-end-to-end](/tests/audit-evidence-collector-end-to-end.md)


## Mechanisms

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

## Entities that must be referenced

- tickets
- documents
- issues
- messages
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [audit-evidence-collector-runbook](/documents/audit-evidence-collector-runbook.md)
