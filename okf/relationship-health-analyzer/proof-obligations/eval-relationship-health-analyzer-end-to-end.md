---
type: Proof Obligation
title: "Golden eval obligation — Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-relationship-health-analyzer-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [relationship-health-analyzer-end-to-end](/tests/relationship-health-analyzer-end-to-end.md)


## Mechanisms

- [query_email_metadata_email_metadata_records](/tools/query-email-metadata-email-metadata-records.md)
- [query_meeting_logs_meeting_logs_records](/tools/query-meeting-logs-meeting-logs-records.md)
- [query_escalation_records_escalation_records_records](/tools/query-escalation-records-escalation-records-records.md)
- [query_survey_data_survey_data_records](/tools/query-survey-data-survey-data-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)
- [action_email_metadata_generate](/tools/action-email-metadata-generate.md)

## Entities that must be referenced

- email_metadata_records
- meeting_logs_records
- escalation_records_records
- survey_data_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [relationship-health-analyzer-policy-guide](/documents/relationship-health-analyzer-policy-guide.md)
