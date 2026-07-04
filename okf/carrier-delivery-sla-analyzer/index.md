---
okf_version: "0.1"
type: Knowledge Bundle
title: Carrier Delivery SLA Analyzer
description: "Reconcile every carrier invoice against contracted rate cards and delivery scans captured in warehouse_orders and pick_tasks so the on-time delivery rate climbs from 89% to 97% and the carrier claim recovery cycle compresses from 45 days to 7 days, with every disputed charge cited against BigQuery baselines before a dispute claim or lane reassignment is drafted."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/carrier-delivery-sla-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:30.719Z"
---

# Carrier Delivery SLA Analyzer

> R-1205 • Supply Chain & Fulfillment

## Overview

- **Persona:** Transportation Manager
- **Department:** retail
- **Objective:** Reconcile every carrier invoice against contracted rate cards and delivery scans captured in warehouse_orders and pick_tasks so the on-time delivery rate climbs from 89% to 97% and the carrier claim recovery cycle compresses from 45 days to 7 days, with every disputed charge cited against BigQuery baselines before a dispute claim or lane reassignment is drafted.

## KPI summary

- **On-time delivery rate**: 89% → 97%
- **Carrier claim recovery cycle**: 45 days → 7 days
- **Cost per package variance vs. contract**: +6.5% → +0.9%

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
