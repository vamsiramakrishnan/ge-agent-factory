---
okf_version: "0.1"
type: Knowledge Bundle
title: Price Execution Audit Monitor
description: "Reconciles every POS transaction price against the Revionics price of record in near real time. Detects stale promo prices, missed activations, and unit-of-measure errors by store and item. so the Pricing Operations Manager can move the Shelf-to-POS price match rate KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/price-execution-audit-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:29.779Z"
---

# Price Execution Audit Monitor

> R-1604 • Pricing & Promotions

## Overview

- **Persona:** Pricing Operations Manager
- **Department:** retail
- **Objective:** Reconciles every POS transaction price against the Revionics price of record in near real time. Detects stale promo prices, missed activations, and unit-of-measure errors by store and item. so the Pricing Operations Manager can move the Shelf-to-POS price match rate KPI.

## KPI summary

- **Shelf-to-POS price match rate**: 94.1% → 99.6%
- **Scan-error margin leakage**: $4.2M/yr → $0.6M/yr
- **Time to detect a mis-scanned price**: 2 weeks → 2 hours

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
