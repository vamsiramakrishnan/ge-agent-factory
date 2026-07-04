---
okf_version: "0.1"
type: Knowledge Bundle
title: Scrap and Rework Analytics Engine
description: "Joins Siemens Opcenter MES production_orders, machine_events, and quality_checks with SAP S/4HANA PP process_orders and work_center_confirmations in BigQuery nightly to attribute scrap dollars to machine, shift, material lot, and operator, cutting the Scrap rate from 3.8% toward 2.1% and collapsing the Scrap variance investigation cycle from 10 days to under 1 day."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/scrap-and-rework-analytics-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:15.955Z"
---

# Scrap and Rework Analytics Engine

> M-5105 • Production & Shop Floor

## Overview

- **Persona:** Plant Controller
- **Department:** manufacturing
- **Objective:** Joins Siemens Opcenter MES production_orders, machine_events, and quality_checks with SAP S/4HANA PP process_orders and work_center_confirmations in BigQuery nightly to attribute scrap dollars to machine, shift, material lot, and operator, cutting the Scrap rate from 3.8% toward 2.1% and collapsing the Scrap variance investigation cycle from 10 days to under 1 day.

## KPI summary

- **Scrap rate**: 3.8% → 2.1%
- **Monthly scrap cost**: $290K → $155K
- **Scrap variance investigation cycle**: 10 days → 1 day

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
