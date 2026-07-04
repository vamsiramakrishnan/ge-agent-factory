---
type: Workflow Stage
title: "Tone Shift Detection & Early Warning"
description: "Gemini interprets qualitative signals that analytics miss: supplier account manager response time shifted from same-day to 3-4 days, VP of Sales attended the last QBR (unusual). Detects tone shifts in meeting notes: 'Supplier language shifted from partnership to contractual obligations over 3 QBRs — declining relationship health.' Generates early-warning briefs for SRM."
source_id: tone_shift_detection_early_warning
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Tone Shift Detection & Early Warning

Gemini interprets qualitative signals that analytics miss: supplier account manager response time shifted from same-day to 3-4 days, VP of Sales attended the last QBR (unusual). Detects tone shifts in meeting notes: 'Supplier language shifted from partnership to contractual obligations over 3 QBRs — declining relationship health.' Generates early-warning briefs for SRM.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)
