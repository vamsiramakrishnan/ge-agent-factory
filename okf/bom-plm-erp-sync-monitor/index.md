---
okf_version: "0.1"
type: Knowledge Bundle
title: "BOM PLM-ERP Sync Monitor"
description: "Reduce active BOM discrepancies between PTC Windchill PLM and SAP S/4HANA PP from 260 to 15 by nightly reconciling engineering_change_orders and bom_revisions against process_orders and material_stagings, cutting discrepancy detection lag from 3 weeks to 1 day and driving builds executed against stale BOMs from 6 per quarter to 0."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/bom-plm-erp-sync-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:23.129Z"
---

# BOM PLM-ERP Sync Monitor

> M-5502 • Engineering & PLM

## Overview

- **Persona:** PLM Administrator
- **Department:** manufacturing
- **Objective:** Reduce active BOM discrepancies between PTC Windchill PLM and SAP S/4HANA PP from 260 to 15 by nightly reconciling engineering_change_orders and bom_revisions against process_orders and material_stagings, cutting discrepancy detection lag from 3 weeks to 1 day and driving builds executed against stale BOMs from 6 per quarter to 0.

## KPI summary

- **BOM discrepancies between PLM and ERP**: 260 active → 15 active
- **Builds executed against stale BOMs**: 6 per quarter → 0 per quarter
- **Discrepancy detection lag**: 3 weeks → 1 day

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
