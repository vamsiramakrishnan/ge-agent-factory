---
type: Workflow Stage
title: Retrieve Records
description: "Query pos transactions and tender records from Oracle Xstore POS and correlate with Salesforce Marketing Cloud for the Lapsed Member Win-Back Orchestrator workflow."
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query pos transactions and tender records from Oracle Xstore POS and correlate with Salesforce Marketing Cloud for the Lapsed Member Win-Back Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
