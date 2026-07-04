---
okf_version: "0.1"
type: Knowledge Bundle
title: Supplier Delivery Risk Analyzer
description: "Scores every open purchase order's late-delivery probability from the supplier's rolling performance, order size, and lead-time trend in BigQuery. Simulates the production impact of predicted slips through Kinaxis RapidResponse and highlights the POs worth chasing this week. so the Materials Manager can move the Supplier on-time delivery KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/supplier-delivery-risk-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:11.997Z"
---

# Supplier Delivery Risk Analyzer

> M-5402 • Supply Chain & Materials

## Overview

- **Persona:** Materials Manager
- **Department:** manufacturing
- **Objective:** Scores every open purchase order's late-delivery probability from the supplier's rolling performance, order size, and lead-time trend in BigQuery. Simulates the production impact of predicted slips through Kinaxis RapidResponse and highlights the POs worth chasing this week. so the Materials Manager can move the Supplier on-time delivery KPI.

## KPI summary

- **Supplier on-time delivery**: 84% → 95%
- **POs flagged at risk before due date**: 10% → 72%
- **Safety stock held against unreliable suppliers**: $3.1M → $1.9M

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
