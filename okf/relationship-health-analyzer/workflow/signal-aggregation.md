---
type: Workflow Stage
title: Signal Aggregation
description: "Aggregate communication metadata (response times, email frequency, meeting attendance), escalation logs, and survey responses from multiple channels into a unified relationship signal dataset."
source_id: signal_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Aggregation

Aggregate communication metadata (response times, email frequency, meeting attendance), escalation logs, and survey responses from multiple channels into a unified relationship signal dataset.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_email_metadata_email_metadata_records](/tools/query-email-metadata-email-metadata-records.md)
- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [query_escalation_records_escalation_records_records](/tools/query-escalation-records-escalation-records-records.md)
- [query_survey_data_survey_data_records](/tools/query-survey-data-survey-data-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)

Next: [Sentiment & Health Scoring](/workflow/sentiment-health-scoring.md)
