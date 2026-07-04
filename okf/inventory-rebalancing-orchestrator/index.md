---
okf_version: "0.1"
type: Knowledge Bundle
title: Inventory Rebalancing Orchestrator
description: "Every night, reconcile supply_plans and demand_signals across plants in Kinaxis RapidResponse against SAP S/4HANA MM purchase_orders and material_movements to surface surplus-deficit pairs, then recommend costed inter-site stock transport orders that cut inter-site transfer cycle time from 12 days to 4 days and shrink excess and obsolete inventory from $4.8M toward $2.6M."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/inventory-rebalancing-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:21.473Z"
---

# Inventory Rebalancing Orchestrator

> M-5403 • Supply Chain & Materials

## Overview

- **Persona:** Inventory Analyst
- **Department:** manufacturing
- **Objective:** Every night, reconcile supply_plans and demand_signals across plants in Kinaxis RapidResponse against SAP S/4HANA MM purchase_orders and material_movements to surface surplus-deficit pairs, then recommend costed inter-site stock transport orders that cut inter-site transfer cycle time from 12 days to 4 days and shrink excess and obsolete inventory from $4.8M toward $2.6M.

## KPI summary

- **Excess and obsolete inventory**: $4.8M → $2.6M
- **Inter-site transfer cycle time**: 12 days → 4 days
- **Inventory turns**: 5.2 → 7.4

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
