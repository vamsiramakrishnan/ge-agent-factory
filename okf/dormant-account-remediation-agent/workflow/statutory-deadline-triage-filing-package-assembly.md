---
type: Workflow Stage
title: "Statutory Deadline Triage & Filing Package Assembly"
description: "Score current_balance and days-to-statutory-deadline for each cohort, then assemble the escheatment filing package using lookup_dormant_account_remediation_agent_compliance_policy citations for accounts inside the state filing window."
source_id: statutory_deadline_triage_filing_package_assembly
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Statutory Deadline Triage & Filing Package Assembly

Score current_balance and days-to-statutory-deadline for each cohort, then assemble the escheatment filing package using lookup_dormant_account_remediation_agent_compliance_policy citations for accounts inside the state filing window.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

Next: [Branch & Queue Task Routing](/workflow/branch-queue-task-routing.md)
