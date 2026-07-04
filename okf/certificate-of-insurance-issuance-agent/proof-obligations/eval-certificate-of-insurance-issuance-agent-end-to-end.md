---
type: Proof Obligation
title: "Golden eval obligation — Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-certificate-of-insurance-issuance-agent-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [certificate-of-insurance-issuance-agent-end-to-end](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)


## Mechanisms

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

## Entities that must be referenced

- policy_forms
- envelopes
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [certificate-of-insurance-issuance-agent-authority-guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
