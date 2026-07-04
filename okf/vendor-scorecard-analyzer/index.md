---
okf_version: "0.1"
type: Knowledge Bundle
title: Vendor Performance Scorecard Analyzer
description: "Reconcile weekly Oracle Retail MFCS item_master, merchandise_hierarchy, and cost_changes against BigQuery analytics_events and historical_metrics baselines to score every vendor's fill rate, on-time delivery, lead-time variance, and invoice accuracy, lifting vendor fill rate from 88% to 96% and recovering up to $3.4M/yr in chargeback-eligible compliance claims."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/vendor-scorecard-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:28.640Z"
---

# Vendor Performance Scorecard Analyzer

> R-1105 • Merchandising & Assortment

## Overview

- **Persona:** Vendor Performance Manager
- **Department:** retail
- **Objective:** Reconcile weekly Oracle Retail MFCS item_master, merchandise_hierarchy, and cost_changes against BigQuery analytics_events and historical_metrics baselines to score every vendor's fill rate, on-time delivery, lead-time variance, and invoice accuracy, lifting vendor fill rate from 88% to 96% and recovering up to $3.4M/yr in chargeback-eligible compliance claims.

## KPI summary

- **Vendor fill rate**: 88% → 96%
- **Scorecard preparation time per vendor**: 6 hours → 10 minutes
- **Cost recovery from compliance claims**: $1.1M/yr → $3.4M/yr

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
