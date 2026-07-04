---
type: Workflow Stage
title: "ACORD Generation & DocuSign Delivery"
description: "Auto-populate the ACORD 25 (or applicable ACORD form_code) from the verified Duck Creek Policy data, route the envelope through DocuSign for delivery to the certificate holder, and record recipients and audit_trails for the transaction."
source_id: acord_generation_docu_sign_delivery
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ACORD Generation & DocuSign Delivery

Auto-populate the ACORD 25 (or applicable ACORD form_code) from the verified Duck Creek Policy data, route the envelope through DocuSign for delivery to the certificate holder, and record recipients and audit_trails for the transaction.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

Next: [Escalation & KPI Reconciliation](/workflow/escalation-kpi-reconciliation.md)
