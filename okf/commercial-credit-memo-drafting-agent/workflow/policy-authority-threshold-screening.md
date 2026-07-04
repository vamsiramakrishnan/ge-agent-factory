---
type: Workflow Stage
title: "Policy & Authority Threshold Screening"
description: "Screen risk_rating, ltv, and policy_exception_count against the Commercial Credit Memo Drafting Agent Banking Compliance Policy and the Delegated Lending Authority & House Hold-Limit Matrix using lookup_commercial_credit_memo_drafting_agent_compliance_policy, flagging LTV, hold-limit, or stacked-exception overages."
source_id: policy_authority_threshold_screening
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy & Authority Threshold Screening

Screen risk_rating, ltv, and policy_exception_count against the Commercial Credit Memo Drafting Agent Banking Compliance Policy and the Delegated Lending Authority & House Hold-Limit Matrix using lookup_commercial_credit_memo_drafting_agent_compliance_policy, flagging LTV, hold-limit, or stacked-exception overages.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)

Next: [Narrative Drafting via Vertex AI](/workflow/narrative-drafting-via-vertex-ai.md)
