---
okf_version: "0.1"
type: Knowledge Bundle
title: RAN Parameter Optimization Agent
description: "The agent scores per-cluster performance_counters and network_alarms against historical_metrics baselines to identify the worst-offending tilt, power, and mobility parameter sets, stages tilt/power/handover-threshold changes for RF Optimization Engineer approval, and verifies post-change KPIs within 24 hours -- driving drop call rate in optimized clusters from 0.9% to 0.35% and handover failure rate from 2.8% to 1.1%."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/ran-parameter-optimization-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:45.476Z"
---

# RAN Parameter Optimization Agent

> T-4305 • Network Operations & Assurance

## Overview

- **Persona:** RF Optimization Engineer
- **Department:** telco
- **Objective:** The agent scores per-cluster performance_counters and network_alarms against historical_metrics baselines to identify the worst-offending tilt, power, and mobility parameter sets, stages tilt/power/handover-threshold changes for RF Optimization Engineer approval, and verifies post-change KPIs within 24 hours -- driving drop call rate in optimized clusters from 0.9% to 0.35% and handover failure rate from 2.8% to 1.1%.

## KPI summary

- **Drop call rate in optimized clusters**: 0.9% → 0.35%
- **Parameter change cycle time**: 3 weeks per cluster → 2 days per cluster
- **Handover failure rate**: 2.8% → 1.1%

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
