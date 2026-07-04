---
okf_version: "0.1"
type: Knowledge Bundle
title: Usage Rating Anomaly Monitor
description: "The monitor baselines rated revenue per product, plan, and event type daily and flags statistical deviations within hours of a catalog change. It classifies suspense records by failure cause and auto-reprocesses those matching known correction patterns. so the Revenue Assurance Analyst can move the Rating error detection time KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/usage-rating-anomaly-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:38.937Z"
---

# Usage Rating Anomaly Monitor

> T-4405 • Billing & Revenue Assurance

## Overview

- **Persona:** Revenue Assurance Analyst
- **Department:** telco
- **Objective:** The monitor baselines rated revenue per product, plan, and event type daily and flags statistical deviations within hours of a catalog change. It classifies suspense records by failure cause and auto-reprocesses those matching known correction patterns. so the Revenue Assurance Analyst can move the Rating error detection time KPI.

## KPI summary

- **Rating error detection time**: post-invoice, 30+ days → same day
- **Invoice rebill rate**: 3.2% of invoices → 0.6% of invoices
- **Suspense/unrated record backlog**: 4.5M records → under 200K records

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
