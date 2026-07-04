---
type: Workflow Stage
title: "Appetite Matrix & Line-of-Business Screening"
description: "Score policies and policy_quotes attributes (line_of_business, jurisdiction_state, underwriting_tier) against the current appetite bands defined in the Submission Appetite Screening Agent Authority & Referral Guide to sort each submission into clear in-appetite, clear decline, or borderline."
source_id: appetite_matrix_line_of_business_screening
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Appetite Matrix & Line-of-Business Screening

Score policies and policy_quotes attributes (line_of_business, jurisdiction_state, underwriting_tier) against the current appetite bands defined in the Submission Appetite Screening Agent Authority & Referral Guide to sort each submission into clear in-appetite, clear decline, or borderline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

Next: [Loss History & Risk Enrichment](/workflow/loss-history-risk-enrichment.md)
