---
okf_version: "0.1"
type: Knowledge Bundle
title: ACH Return Root Cause Analyzer
description: "Analyzes daily ACH return files from the FIS Payments Hub, clustering returns by originator, SEC code, and root cause. Notifies relationship owners when an originator trends toward the 0.5% unauthorized threshold with a projected breach date. so the ACH Operations Analyst can move the Unauthorized return rate on originations KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/ach-return-root-cause-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:45.370Z"
---

# ACH Return Root Cause Analyzer

> B-2304 • Payments & Fraud

## Overview

- **Persona:** ACH Operations Analyst
- **Department:** banking
- **Objective:** Analyzes daily ACH return files from the FIS Payments Hub, clustering returns by originator, SEC code, and root cause. Notifies relationship owners when an originator trends toward the 0.5% unauthorized threshold with a projected breach date. so the ACH Operations Analyst can move the Unauthorized return rate on originations KPI.

## KPI summary

- **Unauthorized return rate on originations**: 0.42% → 0.19%
- **Time to identify a problem originator**: 3 weeks → 1 day
- **Nacha compliance inquiries per year**: 5 → 0

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
