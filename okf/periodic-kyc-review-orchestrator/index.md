---
okf_version: "0.1"
type: Knowledge Bundle
title: Periodic KYC Review Orchestrator
description: "Orchestrates the review pipeline by risk tier and due date, pre-building each case file with activity-versus-profile comparisons from BigQuery. Auto-completes low-risk reviews with no material changes and generates a documented rationale for QA sampling. so the KYC Operations Manager can move the Overdue periodic reviews KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/periodic-kyc-review-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:47.530Z"
---

# Periodic KYC Review Orchestrator

> B-2404 • KYC, AML & Compliance

## Overview

- **Persona:** KYC Operations Manager
- **Department:** banking
- **Objective:** Orchestrates the review pipeline by risk tier and due date, pre-building each case file with activity-versus-profile comparisons from BigQuery. Auto-completes low-risk reviews with no material changes and generates a documented rationale for QA sampling. so the KYC Operations Manager can move the Overdue periodic reviews KPI.

## KPI summary

- **Overdue periodic reviews**: 3,100 → 180
- **Reviews completed per analyst per week**: 12 → 38
- **High-risk reviews past due date**: 240 → 0

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
