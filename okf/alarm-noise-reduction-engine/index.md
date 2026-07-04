---
okf_version: "0.1"
type: Knowledge Bundle
title: Alarm Noise Reduction Engine
description: "Correlate raw Ericsson Network Manager network_alarms and cell_sites topology with Splunk log_events and BigQuery historical baselines into single root-cause incidents, lifting the actionable alarm ratio from 1 in 40 alarms to 1 in 3 alarms and cutting P1 MTTR from 4.2 hours to 1.4 hours while preserving a full audit trail."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/alarm-noise-reduction-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:43.800Z"
---

# Alarm Noise Reduction Engine

> T-4301 • Network Operations & Assurance

## Overview

- **Persona:** NOC Engineer
- **Department:** telco
- **Objective:** Correlate raw Ericsson Network Manager network_alarms and cell_sites topology with Splunk log_events and BigQuery historical baselines into single root-cause incidents, lifting the actionable alarm ratio from 1 in 40 alarms to 1 in 3 alarms and cutting P1 MTTR from 4.2 hours to 1.4 hours while preserving a full audit trail.

## KPI summary

- **Actionable alarm ratio**: 1 in 40 alarms → 1 in 3 alarms
- **MTTR for P1 network incidents**: 4.2 hours → 1.4 hours
- **NOC alarms handled per engineer shift**: 1,200 → 90 correlated cases

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
