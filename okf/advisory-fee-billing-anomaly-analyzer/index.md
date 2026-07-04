---
okf_version: "0.1"
type: Knowledge Bundle
title: Advisory Fee Billing Anomaly Analyzer
description: "Recomputes every account's expected fee from the contracted schedule, householding rules, and billable-asset data in BigQuery. Flags discrepancies against the actual fee run with a root-cause classification before invoices are released. so the Advisory Operations Manager can move the Fee errors caught before client billing KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/advisory-fee-billing-anomaly-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:50.141Z"
---

# Advisory Fee Billing Anomaly Analyzer

> B-2505 • Wealth & Advisory

## Overview

- **Persona:** Advisory Operations Manager
- **Department:** banking
- **Objective:** Recomputes every account's expected fee from the contracted schedule, householding rules, and billable-asset data in BigQuery. Flags discrepancies against the actual fee run with a root-cause classification before invoices are released. so the Advisory Operations Manager can move the Fee errors caught before client billing KPI.

## KPI summary

- **Fee errors caught before client billing**: 35% → 96%
- **Client fee reimbursements per year**: $380K → $45K
- **Quarterly billing audit cycle time**: 3 weeks → 2 days

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
