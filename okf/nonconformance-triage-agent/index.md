---
okf_version: "0.1"
type: Knowledge Bundle
title: Nonconformance Triage Agent
description: "Triage every new SAP S/4HANA QM nonconformance_records entry within the shift it's detected by correlating inspection_lots and Opcenter MES production_orders genealogy, scoring severity and MRB exposure, and routing a cited disposition recommendation so NC disposition cycle time falls from 26 hours to 4 hours and material held in the MRB area drops from $1.2M to $380K."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/nonconformance-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:17.655Z"
---

# Nonconformance Triage Agent

> M-5204 • Quality Management

## Overview

- **Persona:** Shift Quality Lead
- **Department:** manufacturing
- **Objective:** Triage every new SAP S/4HANA QM nonconformance_records entry within the shift it's detected by correlating inspection_lots and Opcenter MES production_orders genealogy, scoring severity and MRB exposure, and routing a cited disposition recommendation so NC disposition cycle time falls from 26 hours to 4 hours and material held in the MRB area drops from $1.2M to $380K.

## KPI summary

- **NC disposition cycle time**: 26 hours → 4 hours
- **Material held in MRB area**: $1.2M → $380K
- **Misrouted NC notifications**: 18% → 3%

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
