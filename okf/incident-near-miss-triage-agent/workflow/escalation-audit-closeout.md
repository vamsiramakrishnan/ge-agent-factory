---
type: Workflow Stage
title: "Escalation & Audit Closeout"
description: "Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-potential and reportability-triggering cases, attach the generated_audit_trail, and notify the Site Safety Officer of the outcome."
source_id: escalation_audit_closeout
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Audit Closeout

Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-potential and reportability-triggering cases, attach the generated_audit_trail, and notify the Site Safety Officer of the outcome.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)
