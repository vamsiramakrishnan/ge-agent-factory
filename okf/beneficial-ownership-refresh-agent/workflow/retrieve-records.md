---
type: Workflow Stage
title: Retrieve Records
description: Query kyc cases and entity profiles from Fenergo CLM and correlate with DocuSign for the Beneficial Ownership Refresh Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query kyc cases and entity profiles from Fenergo CLM and correlate with DocuSign for the Beneficial Ownership Refresh Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
