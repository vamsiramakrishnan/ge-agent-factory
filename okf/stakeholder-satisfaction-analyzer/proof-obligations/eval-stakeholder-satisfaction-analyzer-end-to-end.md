---
type: Proof Obligation
title: "Golden eval obligation — Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-stakeholder-satisfaction-analyzer-end-to-end"
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

# Golden eval obligation — Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [stakeholder-satisfaction-analyzer-end-to-end](/tests/stakeholder-satisfaction-analyzer-end-to-end.md)


## Mechanisms

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_email_data_email_data_records](/tools/query-email-data-email-data-records.md)
- [lookup_stakeholder_satisfaction_analyzer_policy_guide](/tools/lookup-stakeholder-satisfaction-analyzer-policy-guide.md)
- [action_qualtrics_generate](/tools/action-qualtrics-generate.md)

## Entities that must be referenced

- survey_responses
- tickets
- email_data_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [stakeholder-satisfaction-analyzer-policy-guide](/documents/stakeholder-satisfaction-analyzer-policy-guide.md)
