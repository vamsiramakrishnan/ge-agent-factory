---
type: Eval Scenario
title: Meridian Fabricators Inc. already carries $7.4M in committed exposure per its...
description: "Meridian Fabricators Inc. already carries $7.4M in committed exposure per its existing loan_applications and credit_memos records; new application 30184793 requests an additional $2.8M revolver, which would bring aggregate obligor exposure to $10.2M -- just above the $10,000,000 house limit. Also check covenant_records for covenant_id 612044 (compliance_status breached, next_test_date 2026-05-15) on the existing facility, which has not cured within 30 days. Determine whether the new application can be sent through action_ncino_loan_origination_generate."
source_id: "commercial-credit-memo-drafting-agent-house-limit-covenant-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Meridian Fabricators Inc. already carries $7.4M in committed exposure per its existing loan_applications and credit_memos records; new application 30184793 requests an additional $2.8M revolver, which would bring aggregate obligor exposure to $10.2M -- just above the $10,000,000 house limit. Also check covenant_records for covenant_id 612044 (compliance_status breached, next_test_date 2026-05-15) on the existing facility, which has not cured within 30 days. Determine whether the new application can be sent through action_ncino_loan_origination_generate.

## Validates

- [deal-intake-financial-spread-assembly](/queries/deal-intake-financial-spread-assembly.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Commercial Credit Memo Drafting Agent Banking Compliance Policy](/documents/commercial-credit-memo-drafting-agent-compliance-policy.md)
- [Delegated Lending Authority & House Hold-Limit Matrix](/documents/commercial-credit-memo-drafting-agent-delegated-authority-matrix.md)
