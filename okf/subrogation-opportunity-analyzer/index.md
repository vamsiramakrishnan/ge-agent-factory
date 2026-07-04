---
okf_version: "0.1"
type: Knowledge Bundle
title: Subrogation Opportunity Analyzer
description: "Scans open and recently closed claims nightly, reading adjuster notes, police reports, and loss descriptions for third-party liability signals. Scores each claim's recovery likelihood and expected value using historical recovery outcomes stored in BigQuery. so the Subrogation Specialist can move the Subrogation identification rate KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/subrogation-opportunity-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:55.183Z"
---

# Subrogation Opportunity Analyzer

> I-3202 • Claims

## Overview

- **Persona:** Subrogation Specialist
- **Department:** insurance
- **Objective:** Scans open and recently closed claims nightly, reading adjuster notes, police reports, and loss descriptions for third-party liability signals. Scores each claim's recovery likelihood and expected value using historical recovery outcomes stored in BigQuery. so the Subrogation Specialist can move the Subrogation identification rate KPI.

## KPI summary

- **Subrogation identification rate**: 11% of eligible claims → 27% of eligible claims
- **Net subrogation recoveries**: $8.2M annually → $14.6M annually
- **Days from payment to subro referral**: 94 days → 9 days

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
