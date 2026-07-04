---
type: Workflow Stage
title: "Referral, Authority & Sanctions Gating"
description: "Cross-check total_insured_value and requested limits against the letter-of-authority grid and OFAC/coastal wind-pool triggers in the Authority & Referral Guide and the Coastal Wind & Catastrophe Aggregation Referral Playbook, gating anything above threshold before a disposition is issued."
source_id: referral_authority_sanctions_gating
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Referral, Authority & Sanctions Gating

Cross-check total_insured_value and requested limits against the letter-of-authority grid and OFAC/coastal wind-pool triggers in the Authority & Referral Guide and the Coastal Wind & Catastrophe Aggregation Referral Playbook, gating anything above threshold before a disposition is issued.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

Next: [Desk Assignment, Decline Drafting & Audit Filing](/workflow/desk-assignment-decline-drafting-audit-filing.md)
