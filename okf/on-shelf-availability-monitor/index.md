---
okf_version: "0.1"
type: Knowledge Bundle
title: "On-Shelf Availability Monitor"
description: "Continuously scan Oracle Xstore POS pos_transactions and store_shift_summaries for zero-sales-with-positive-on-hand anomalies against BigQuery historical_metrics and analytics_events sell-rate baselines, pushing prioritized shelf-recovery and cycle-count tasks that lift on-shelf availability from 91% to 97.5% and recover $2.6M/qtr in lost sales chain-wide."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/on-shelf-availability-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:31.981Z"
---

# On-Shelf Availability Monitor

> R-1303 • Store Operations

## Overview

- **Persona:** Store Operations Director
- **Department:** retail
- **Objective:** Continuously scan Oracle Xstore POS pos_transactions and store_shift_summaries for zero-sales-with-positive-on-hand anomalies against BigQuery historical_metrics and analytics_events sell-rate baselines, pushing prioritized shelf-recovery and cycle-count tasks that lift on-shelf availability from 91% to 97.5% and recover $2.6M/qtr in lost sales chain-wide.

## KPI summary

- **On-shelf availability**: 91% → 97.5%
- **Phantom-inventory positions detected/week**: 0 (untracked) → 4,800
- **Recovered sales from OSA fixes**: $0 baseline → $2.6M/qtr

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
