---
type: Workflow Stage
title: "Generate & Audit"
description: "Execute action_oracle_retail_mfcs_generate in Oracle Retail MFCS once two-system evidence and playbook/manual citations are attached, emitting a generated_audit_trail and escalating exceptions per the escalation rules."
source_id: generate_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Generate & Audit

Execute action_oracle_retail_mfcs_generate in Oracle Retail MFCS once two-system evidence and playbook/manual citations are attached, emitting a generated_audit_trail and escalating exceptions per the escalation rules.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [action_oracle_retail_mfcs_generate](/tools/action-oracle-retail-mfcs-generate.md)
