---
okf_version: "0.1"
type: Knowledge Bundle
title: Predictive Asset Failure Monitor
description: "Continuously scores critical-asset sensor streams from the PI System in BigQuery against learned degradation signatures. Raises an early-warning alert with estimated remaining useful life when an asset's signature departs from its healthy baseline. so the Reliability Engineer can move the Unplanned downtime hours KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/predictive-asset-failure-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:09.466Z"
---

# Predictive Asset Failure Monitor

> M-5301 • Maintenance & Reliability

## Overview

- **Persona:** Reliability Engineer
- **Department:** manufacturing
- **Objective:** Continuously scores critical-asset sensor streams from the PI System in BigQuery against learned degradation signatures. Raises an early-warning alert with estimated remaining useful life when an asset's signature departs from its healthy baseline. so the Reliability Engineer can move the Unplanned downtime hours KPI.

## KPI summary

- **Unplanned downtime hours**: 540 hrs/yr → 210 hrs/yr
- **Failures predicted before functional loss**: 12% → 68%
- **Emergency work orders**: 31% of total → 11% of total

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
