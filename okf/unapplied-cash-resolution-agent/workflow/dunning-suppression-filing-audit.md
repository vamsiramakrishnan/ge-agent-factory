---
type: Workflow Stage
title: "Dunning Suppression, Filing & Audit"
description: "Suppress dunning on accounts with a pending matched receipt, execute the posting via action_guidewire_billingcenter_file with a full audit trail, and escalate suspense items aging past 15 days to the Cash Applications Specialist."
source_id: dunning_suppression_filing_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dunning Suppression, Filing & Audit

Suppress dunning on accounts with a pending matched receipt, execute the posting via action_guidewire_billingcenter_file with a full audit trail, and escalate suspense items aging past 15 days to the Cash Applications Specialist.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)
