---
type: Workflow Stage
title: Evidence Aggregation
description: "On deal close, pull opportunity data from Salesforce, retrieve Gong call recordings and transcripts, and trigger buyer win/loss survey. Aggregate all evidence for analysis."
source_id: evidence_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Evidence Aggregation

On deal close, pull opportunity data from Salesforce, retrieve Gong call recordings and transcripts, and trigger buyer win/loss survey. Aggregate all evidence for analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [lookup_win_loss_analysis_agent_playbook](/tools/lookup-win-loss-analysis-agent-playbook.md)
- [action_salesforce_crm_route](/tools/action-salesforce-crm-route.md)

Next: [Transcript Intelligence](/workflow/transcript-intelligence.md)
