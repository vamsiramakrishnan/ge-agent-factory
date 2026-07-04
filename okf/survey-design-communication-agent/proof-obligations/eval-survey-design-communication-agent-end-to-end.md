---
type: Proof Obligation
title: "Golden eval obligation — Run the Survey Design & Communication Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-survey-design-communication-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Survey Design & Communication Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [survey-design-communication-agent-end-to-end](/tests/survey-design-communication-agent-end-to-end.md)


## Mechanisms

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_survey_design_communication_agent_policy_handbook](/tools/lookup-survey-design-communication-agent-policy-handbook.md)

## Entities that must be referenced

- survey_responses
- engagement_surveys
- messages
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [survey-design-communication-agent-policy-handbook](/documents/survey-design-communication-agent-policy-handbook.md)
