---
type: Eval Scenario
title: While running the Dormant Account Remediation Agent workflow you encounter th...
description: "While running the Dormant Account Remediation Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end."
source_id: "dormant-account-remediation-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Dormant Account Remediation Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Dormant Account Remediation Agent Banking Compliance Policy](/documents/dormant-account-remediation-agent-compliance-policy.md)
