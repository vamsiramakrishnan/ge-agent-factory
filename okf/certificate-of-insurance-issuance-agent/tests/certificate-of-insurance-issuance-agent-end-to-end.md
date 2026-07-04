---
type: Eval Scenario
title: Run the Certificate of Insurance Issuance Agent workflow for the current peri...
description: "Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "certificate-of-insurance-issuance-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [acord-generation-docu-sign-delivery](/queries/acord-generation-docu-sign-delivery.md)

## Mechanisms to call

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

## Success rubric

Action escalate executed against Duck Creek Policy, with audit-trail entry and Policy Services Rep notified of outcomes.

# Citations

- [Certificate of Insurance Issuance Agent Authority & Referral Guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
