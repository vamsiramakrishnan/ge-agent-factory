---
type: Query Capability
title: "Gemini interprets qualitative signals that analytics miss: supplier account m..."
description: "Gemini interprets qualitative signals that analytics miss: supplier account manager response time shifted from same-day to 3-4 days, VP of Sales attended the last QBR (unusual). Detects tone shifts in meeting notes: 'Supplier language shifted from partnership to contractual obligations over 3 QBRs — declining relationship health.' Generates early-warning briefs for SRM."
source_id: "tone-shift-detection-early-warning"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets qualitative signals that analytics miss: supplier account manager response time shifted from same-day to 3-4 days, VP of Sales attended the last QBR (unusual). Detects tone shifts in meeting notes: 'Supplier language shifted from partnership to contractual obligations over 3 QBRs — declining relationship health.' Generates early-warning briefs for SRM.

## Tools used

- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)

## Runs in

- [tone_shift_detection_early_warning](/workflow/tone-shift-detection-early-warning.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/relationship-health-analyzer-end-to-end.md)

# Citations

- [Relationship Health Analyzer Procurement Policy Guide](/documents/relationship-health-analyzer-policy-guide.md)
