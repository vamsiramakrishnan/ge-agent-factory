---
okf_version: "0.1"
type: Knowledge Bundle
title: Shrink Anomaly Analyzer
description: "Scores every transaction stream nightly for void, refund, no-sale, and discount anomalies at cashier and store level. Builds ranked case files linking POS events, timeclock data, and inventory adjustments for each anomaly cluster. so the Loss Prevention Manager can move the Shrink rate KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/shrink-anomaly-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:22.105Z"
---

# Shrink Anomaly Analyzer

> R-1301 • Store Operations

## Overview

- **Persona:** Loss Prevention Manager
- **Department:** retail
- **Objective:** Scores every transaction stream nightly for void, refund, no-sale, and discount anomalies at cashier and store level. Builds ranked case files linking POS events, timeclock data, and inventory adjustments for each anomaly cluster. so the Loss Prevention Manager can move the Shrink rate KPI.

## KPI summary

- **Shrink rate**: 2.3% of sales → 1.4% of sales
- **Time to flag suspicious register activity**: 3 weeks → same day
- **LP investigation hit rate**: 22% → 61%

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
