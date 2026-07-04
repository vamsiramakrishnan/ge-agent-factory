---
type: Query Capability
title: "On deal close, pull opportunity data from Salesforce, retrieve Gong call reco..."
description: "On deal close, pull opportunity data from Salesforce, retrieve Gong call recordings and transcripts, and trigger buyer win/loss survey. Aggregate all evidence for analysis."
source_id: "evidence-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# On deal close, pull opportunity data from Salesforce, retrieve Gong call recordings and transcripts, and trigger buyer win/loss survey. Aggregate all evidence for analysis.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [lookup_win_loss_analysis_agent_playbook](/tools/lookup-win-loss-analysis-agent-playbook.md)
- [action_salesforce_crm_route](/tools/action-salesforce-crm-route.md)

## Runs in

- [evidence_aggregation](/workflow/evidence-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/win-loss-analysis-agent-end-to-end.md)

# Citations

- [Win/Loss Analysis Agent Playbook](/documents/win-loss-analysis-agent-playbook.md)
