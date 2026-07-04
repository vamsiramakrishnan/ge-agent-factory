---
type: Eval Scenario
title: Run the Relationship Health Analyzer workflow for the current period. Cite th...
description: "Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "relationship-health-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-aggregation](/queries/signal-aggregation.md)

## Mechanisms to call

- [query_email_metadata_email_metadata_records](/tools/query-email-metadata-email-metadata-records.md)
- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [query_escalation_records_escalation_records_records](/tools/query-escalation-records-escalation-records-records.md)
- [query_survey_data_survey_data_records](/tools/query-survey-data-survey-data-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)

## Success rubric

Action generate executed against Email Metadata, with audit-trail entry and Supplier Relationship Manager notified of outcomes.

# Citations

- [Relationship Health Analyzer Procurement Policy Guide](/documents/relationship-health-analyzer-policy-guide.md)
