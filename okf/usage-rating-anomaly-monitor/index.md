---
okf_version: "0.1"
type: Knowledge Bundle
title: Usage Rating Anomaly Monitor
description: "Detect rated-revenue baseline deviations in Amdocs CES Billing rated_events within hours of a catalog change (not post-invoice, 30+ days later), drain the suspense/unrated record backlog from 4.5M toward under 200K records, and cut the invoice rebill rate from 3.2% to 0.6% of invoices before each bill run closes."
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
provenance_created_at: "2026-07-04T06:18:47.598Z"
---

# Usage Rating Anomaly Monitor

> T-4405 • Billing & Revenue Assurance

## Overview

- **Persona:** Revenue Assurance Analyst
- **Department:** telco
- **Objective:** Detect rated-revenue baseline deviations in Amdocs CES Billing rated_events within hours of a catalog change (not post-invoice, 30+ days later), drain the suspense/unrated record backlog from 4.5M toward under 200K records, and cut the invoice rebill rate from 3.2% to 0.6% of invoices before each bill run closes.

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
