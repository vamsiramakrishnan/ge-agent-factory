---
okf_version: "0.1"
type: Knowledge Bundle
title: Counterparty Credit Exposure Monitor
description: "Aggregates potential future exposure, collateral balances, and netting-set details from Murex MX.3 into an intraday counterparty view. Monitors market signals such as ratings actions and CDS moves, escalating counterparties whose risk profile deteriorates. so the Counterparty Risk Manager can move the Time to full counterparty exposure view KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/counterparty-credit-exposure-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:51.858Z"
---

# Counterparty Credit Exposure Monitor

> B-2604 • Treasury & Market Risk

## Overview

- **Persona:** Counterparty Risk Manager
- **Department:** banking
- **Objective:** Aggregates potential future exposure, collateral balances, and netting-set details from Murex MX.3 into an intraday counterparty view. Monitors market signals such as ratings actions and CDS moves, escalating counterparties whose risk profile deteriorates. so the Counterparty Risk Manager can move the Time to full counterparty exposure view KPI.

## KPI summary

- **Time to full counterparty exposure view**: T+1 → Intraday
- **Collateral disputes open >5 days**: 40 → 6
- **Wrong-way risk cases identified per quarter**: 2 → 11

## Contents

- [Playbook — role, scope, guardrails](/playbook.md)
- [Source Systems](/systems/index.md)
- [Data Entities](/tables/index.md)
- [Agent Tools](/tools/index.md)
- [Workflow Stages](/workflow/index.md)
- [Query Capabilities](/queries/index.md)
- [Eval Scenarios](/tests/index.md)
- [Source Documents](/documents/index.md)
- [Claims](/claims/index.md)
- [Policies](/policies/index.md)
- [Proof Obligations](/proof-obligations/index.md)
- [KPIs](/kpis.md)
- [Golden Evals](/evals.md)
