---
type: Query Capability
title: "Aggregate communication metadata (response times, email frequency, meeting at..."
description: "Aggregate communication metadata (response times, email frequency, meeting attendance), escalation logs, and survey responses from multiple channels into a unified relationship signal dataset."
source_id: "signal-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate communication metadata (response times, email frequency, meeting attendance), escalation logs, and survey responses from multiple channels into a unified relationship signal dataset.

## Tools used

- [query_email_metadata_email_metadata_records](/tools/query-email-metadata-email-metadata-records.md)
- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [query_escalation_records_escalation_records_records](/tools/query-escalation-records-escalation-records-records.md)
- [query_survey_data_survey_data_records](/tools/query-survey-data-survey-data-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)

## Runs in

- [signal_aggregation](/workflow/signal-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/relationship-health-analyzer-end-to-end.md)

# Citations

- [Relationship Health Analyzer Procurement Policy Guide](/documents/relationship-health-analyzer-policy-guide.md)
