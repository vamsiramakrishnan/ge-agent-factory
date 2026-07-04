---
type: Workflow Stage
title: "Policy-Gated Filing"
description: "Cite the Beneficial Ownership Refresh Agent Banking Compliance Policy and the BOI Verification Runbook before executing action_fenergo_clm_file to update the entity_profiles record, escalating high-risk owners first."
source_id: policy_gated_filing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy-Gated Filing

Cite the Beneficial Ownership Refresh Agent Banking Compliance Policy and the BOI Verification Runbook before executing action_fenergo_clm_file to update the entity_profiles record, escalating high-risk owners first.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)
