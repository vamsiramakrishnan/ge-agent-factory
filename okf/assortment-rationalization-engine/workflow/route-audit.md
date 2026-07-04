---
type: Workflow Stage
title: "Route & Audit"
description: "Execute action_oracle_retail_mfcs_route in Oracle Retail MFCS once two-system evidence and playbook citations are attached, emitting a generated_audit_trail and escalating any exception per the escalation rules."
source_id: route_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route & Audit

Execute action_oracle_retail_mfcs_route in Oracle Retail MFCS once two-system evidence and playbook citations are attached, emitting a generated_audit_trail and escalating any exception per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_assortment_rationalization_engine_execution_playbook](/tools/lookup-assortment-rationalization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)
