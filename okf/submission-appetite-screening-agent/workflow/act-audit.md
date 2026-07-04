---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Underwriter."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Underwriter.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)
