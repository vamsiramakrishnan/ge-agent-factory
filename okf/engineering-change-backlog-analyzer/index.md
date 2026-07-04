---
okf_version: "0.1"
type: Knowledge Bundle
title: Engineering Change Backlog Analyzer
description: "Clusters the open change request backlog in PTC Windchill PLM by affected part and problem description, merging duplicates and linking related Jira issues. Scores each request on cost impact, quality risk, and affected production volume from BigQuery data. so the Design Engineer can move the Open change requests older than 90 days KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/engineering-change-backlog-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:14.957Z"
---

# Engineering Change Backlog Analyzer

> M-5504 • Engineering & PLM

## Overview

- **Persona:** Design Engineer
- **Department:** manufacturing
- **Objective:** Clusters the open change request backlog in PTC Windchill PLM by affected part and problem description, merging duplicates and linking related Jira issues. Scores each request on cost impact, quality risk, and affected production volume from BigQuery data. so the Design Engineer can move the Open change requests older than 90 days KPI.

## KPI summary

- **Open change requests older than 90 days**: 170 → 35
- **Change board meeting throughput**: 8 CRs per session → 20 CRs per session
- **Duplicate change requests**: 11% → 2%

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
