---
type: Eval Scenario
title: While running the Portfolio Review Preparation Agent workflow you encounter t...
description: "While running the Portfolio Review Preparation Agent workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end."
source_id: "portfolio-review-prep-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Portfolio Review Preparation Agent workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end.

## Validates

- [book-due-date-household-triage](/queries/book-due-date-household-triage.md)

## Mechanisms to call

- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Portfolio Review Preparation Agent Banking Compliance Policy](/documents/portfolio-review-prep-agent-compliance-policy.md)
