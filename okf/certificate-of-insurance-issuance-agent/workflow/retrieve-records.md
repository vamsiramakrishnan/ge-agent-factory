---
type: Workflow Stage
title: Retrieve Records
description: Query policy forms and rating worksheets from Duck Creek Policy and correlate with DocuSign for the Certificate of Insurance Issuance Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policy forms and rating worksheets from Duck Creek Policy and correlate with DocuSign for the Certificate of Insurance Issuance Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
