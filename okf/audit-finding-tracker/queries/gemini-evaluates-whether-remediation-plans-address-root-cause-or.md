---
type: Query Capability
title: Gemini evaluates whether remediation plans address root cause or just treat s...
description: Gemini evaluates whether remediation plans address root cause or just treat symptoms
source_id: "gemini-evaluates-whether-remediation-plans-address-root-cause-or"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini evaluates whether remediation plans address root cause or just treat symptoms

## Tools used

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_audit_finding_tracker_controls_playbook](/tools/lookup-audit-finding-tracker-controls-playbook.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-finding-tracker-end-to-end.md)

# Citations

- [Audit Finding Tracker Controls Playbook](/documents/audit-finding-tracker-controls-playbook.md)
