---
okf_version: "0.1"
type: Knowledge Bundle
title: Spare Parts Stockout Prediction Agent
description: "Predict stockout risk for critical spares by fusing IBM Maximo work-order demand signals with SAP S/4HANA MM on-hand and on-order quantities, cutting stockout-driven downtime from 95 to 20 hours per year while lowering spare parts inventory value from $6.4M to $5.1M and lifting critical spares service level to 99%."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/spare-parts-stockout-prediction-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:19.343Z"
---

# Spare Parts Stockout Prediction Agent

> M-5303 • Maintenance & Reliability

## Overview

- **Persona:** MRO Storeroom Manager
- **Department:** manufacturing
- **Objective:** Predict stockout risk for critical spares by fusing IBM Maximo work-order demand signals with SAP S/4HANA MM on-hand and on-order quantities, cutting stockout-driven downtime from 95 to 20 hours per year while lowering spare parts inventory value from $6.4M to $5.1M and lifting critical spares service level to 99%.

## KPI summary

- **Stockout-driven downtime hours**: 95 hrs/yr → 20 hrs/yr
- **Spare parts inventory value**: $6.4M → $5.1M
- **Critical spares service level**: 88% → 99%

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
