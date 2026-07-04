---
type: Workflow Stage
title: "Filing & Audit Trail"
description: "Execute action_nice_actimize_file in NICE Actimize once evidence and policy gates pass, emit the generated_audit_trail, and notify the AML Compliance Officer of the filing outcome."
source_id: filing_audit_trail
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Filing & Audit Trail

Execute action_nice_actimize_file in NICE Actimize once evidence and policy gates pass, emit the generated_audit_trail, and notify the AML Compliance Officer of the filing outcome.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)
