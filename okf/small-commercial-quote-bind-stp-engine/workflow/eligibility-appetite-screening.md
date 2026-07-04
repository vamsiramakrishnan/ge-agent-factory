---
type: Workflow Stage
title: "Eligibility & Appetite Screening"
description: "Check policy_quotes and underwriting_submissions total_insured_value, jurisdiction_state, and OFAC sanctions screening results to confirm the account sits inside small commercial BOP and workers' comp appetite before rating proceeds in Guidewire PolicyCenter."
source_id: eligibility_appetite_screening
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Eligibility & Appetite Screening

Check policy_quotes and underwriting_submissions total_insured_value, jurisdiction_state, and OFAC sanctions screening results to confirm the account sits inside small commercial BOP and workers' comp appetite before rating proceeds in Guidewire PolicyCenter.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [Automated Risk Scoring & STP Eligibility](/workflow/automated-risk-scoring-stp-eligibility.md)
