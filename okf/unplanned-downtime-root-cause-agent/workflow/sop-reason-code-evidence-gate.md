---
type: Workflow Stage
title: "SOP & Reason-Code Evidence Gate"
description: "Validate the ranked hypothesis and any reason_code or oee_loss_category recommendation against the Unplanned Downtime Root-Cause Agent SOP and the Downtime Reason Code & OEE Loss Attribution Standard via lookup_unplanned_downtime_root_cause_agent_sop before anything is published."
source_id: sop_reason_code_evidence_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Reason-Code Evidence Gate

Validate the ranked hypothesis and any reason_code or oee_loss_category recommendation against the Unplanned Downtime Root-Cause Agent SOP and the Downtime Reason Code & OEE Loss Attribution Standard via lookup_unplanned_downtime_root_cause_agent_sop before anything is published.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

Next: [Escalation & Evidence Package](/workflow/escalation-evidence-package.md)
