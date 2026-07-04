---
type: Query Capability
title: "Sentiment scoring on survey data, response time trending analysis, escalation..."
description: "Sentiment scoring on survey data, response time trending analysis, escalation frequency monitoring, and composite relationship health scoring across multiple dimensions."
source_id: "sentiment-health-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sentiment scoring on survey data, response time trending analysis, escalation frequency monitoring, and composite relationship health scoring across multiple dimensions.

## Tools used

- [query_escalation_records_escalation_records_records](/tools/query-escalation-records-escalation-records-records.md)
- [query_survey_data_survey_data_records](/tools/query-survey-data-survey-data-records.md)
- [lookup_relationship_health_analyzer_policy_guide](/tools/lookup-relationship-health-analyzer-policy-guide.md)

## Runs in

- [sentiment_health_scoring](/workflow/sentiment-health-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/relationship-health-analyzer-end-to-end.md)

# Citations

- [Relationship Health Analyzer Procurement Policy Guide](/documents/relationship-health-analyzer-policy-guide.md)
