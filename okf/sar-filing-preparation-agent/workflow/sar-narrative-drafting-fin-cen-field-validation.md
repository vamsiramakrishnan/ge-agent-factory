---
type: Workflow Stage
title: "SAR Narrative Drafting & FinCEN Field Validation"
description: "Draft the SAR narrative in FinCEN's five-W's structure from investigation_cases and fraud_alerts fields, pre-populate FinCEN form fields, and validate every field against the FinCEN error rules cited in the SAR Filing Preparation Agent Banking Compliance Policy and the FinCEN SAR E-Filing Field Validation Runbook."
source_id: sar_narrative_drafting_fin_cen_field_validation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SAR Narrative Drafting & FinCEN Field Validation

Draft the SAR narrative in FinCEN's five-W's structure from investigation_cases and fraud_alerts fields, pre-populate FinCEN form fields, and validate every field against the FinCEN error rules cited in the SAR Filing Preparation Agent Banking Compliance Policy and the FinCEN SAR E-Filing Field Validation Runbook.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)

Next: [Filing Clock & Continuing-Activity Tracking](/workflow/filing-clock-continuing-activity-tracking.md)
