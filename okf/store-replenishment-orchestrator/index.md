---
okf_version: "0.1"
type: Knowledge Bundle
title: Store Replenishment Orchestrator
description: "Tunes item-store replenishment parameters continuously from sell-through, lead time, and presentation minimums. Rebalances constrained inventory across stores by predicted lost-sales impact rather than fair-share splits. so the Allocation Analyst can move the Out-of-stock rate KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/store-replenishment-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:21.275Z"
---

# Store Replenishment Orchestrator

> R-1204 • Supply Chain & Fulfillment

## Overview

- **Persona:** Allocation Analyst
- **Department:** retail
- **Objective:** Tunes item-store replenishment parameters continuously from sell-through, lead time, and presentation minimums. Rebalances constrained inventory across stores by predicted lost-sales impact rather than fair-share splits. so the Allocation Analyst can move the Out-of-stock rate KPI.

## KPI summary

- **Out-of-stock rate**: 8.2% → 3.1%
- **Store weeks-of-supply variance**: ±4.5 weeks → ±1.2 weeks
- **Manual allocation touches per week**: 1,900 → 220

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
