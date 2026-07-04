---
type: Eval Scenario
title: Run the Beneficial Ownership Refresh Agent workflow for the current period. C...
description: "Run the Beneficial Ownership Refresh Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "beneficial-ownership-refresh-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Beneficial Ownership Refresh Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

## Success rubric

Action file executed against Fenergo CLM, with audit-trail entry and KYC Analyst notified of outcomes.

# Citations

- [Beneficial Ownership Refresh Agent Banking Compliance Policy](/documents/beneficial-ownership-refresh-agent-compliance-policy.md)
