---
okf_version: "0.1"
type: Knowledge Bundle
title: Supplier Quality Scorecard Engine
description: "Refreshes supplier PPM, lot rejection rate, deviation history, and 8D closure speed weekly from SAP QM and SAP S/4HANA MM data in BigQuery. Generates a ranked risk scorecard per supplier and drafts the quarterly business review pack automatically. so the Supplier Quality Engineer can move the Incoming inspection PPM KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/supplier-quality-scorecard-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:08.223Z"
---

# Supplier Quality Scorecard Engine

> M-5203 • Quality Management

## Overview

- **Persona:** Supplier Quality Engineer
- **Department:** manufacturing
- **Objective:** Refreshes supplier PPM, lot rejection rate, deviation history, and 8D closure speed weekly from SAP QM and SAP S/4HANA MM data in BigQuery. Generates a ranked risk scorecard per supplier and drafts the quarterly business review pack automatically. so the Supplier Quality Engineer can move the Incoming inspection PPM KPI.

## KPI summary

- **Incoming inspection PPM**: 4,200 → 1,600
- **Scorecard preparation effort per quarter**: 3 weeks → 2 hours
- **Suppliers on data-backed improvement plans**: 5 → 24

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
