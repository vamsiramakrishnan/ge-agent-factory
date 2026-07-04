---
okf_version: "0.1"
type: Knowledge Bundle
title: Scrap and Rework Analytics Engine
description: "Joins MES defect confirmations with SAP S/4HANA PP order costs in BigQuery nightly to attribute scrap dollars to machine, shift, material lot, and operator. Detects scrap spikes against a rolling baseline and drafts a variance explanation with the top contributing factors. so the Plant Controller can move the Scrap rate KPI."
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
provenance_created_at: "2026-07-04T04:05:06.968Z"
---

# Scrap and Rework Analytics Engine

> M-5105 • Production & Shop Floor

## Overview

- **Persona:** Plant Controller
- **Department:** manufacturing
- **Objective:** Joins MES defect confirmations with SAP S/4HANA PP order costs in BigQuery nightly to attribute scrap dollars to machine, shift, material lot, and operator. Detects scrap spikes against a rolling baseline and drafts a variance explanation with the top contributing factors. so the Plant Controller can move the Scrap rate KPI.

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
