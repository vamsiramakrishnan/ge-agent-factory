---
okf_version: "0.1"
type: Knowledge Bundle
title: CAPA Orchestration Agent
description: "Opens a structured CAPA workspace when a qualifying notification is raised in SAP QM, drafts the problem statement, and proposes similar historical CAPAs from BigQuery. Creates and routes containment, root-cause, and corrective-action tasks in ServiceNow with due dates, and escalates stalled tasks to the quality manager. so the Quality Manager can move the Average CAPA cycle time KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/capa-orchestration-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:07.801Z"
---

# CAPA Orchestration Agent

> M-5202 • Quality Management

## Overview

- **Persona:** Quality Manager
- **Department:** manufacturing
- **Objective:** Opens a structured CAPA workspace when a qualifying notification is raised in SAP QM, drafts the problem statement, and proposes similar historical CAPAs from BigQuery. Creates and routes containment, root-cause, and corrective-action tasks in ServiceNow with due dates, and escalates stalled tasks to the quality manager. so the Quality Manager can move the Average CAPA cycle time KPI.

## KPI summary

- **Average CAPA cycle time**: 84 days → 31 days
- **Overdue CAPA actions**: 38% → 6%
- **Repeat nonconformances on closed CAPAs**: 22% → 8%

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
