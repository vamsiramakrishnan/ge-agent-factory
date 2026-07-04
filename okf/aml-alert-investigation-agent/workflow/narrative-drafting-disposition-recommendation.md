---
type: Workflow Stage
title: "Narrative Drafting & Disposition Recommendation"
description: "Draft the structured case narrative for the bound investigation_cases record, citing compliance policy sections via lookup_aml_alert_investigation_agent_compliance_policy, and recommend a sar_decision (sar_filed, no_sar_warranted, pending_review, continuing_activity_supplemental) with evidence attached."
source_id: narrative_drafting_disposition_recommendation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Narrative Drafting & Disposition Recommendation

Draft the structured case narrative for the bound investigation_cases record, citing compliance policy sections via lookup_aml_alert_investigation_agent_compliance_policy, and recommend a sar_decision (sar_filed, no_sar_warranted, pending_review, continuing_activity_supplemental) with evidence attached.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Filing, Escalation & Audit Handoff](/workflow/filing-escalation-audit-handoff.md)
