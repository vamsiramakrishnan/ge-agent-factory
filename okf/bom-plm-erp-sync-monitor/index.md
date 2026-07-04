---
okf_version: "0.1"
type: Knowledge Bundle
title: "BOM PLM-ERP Sync Monitor"
description: "Compares released PTC Windchill PLM structures against SAP S/4HANA PP production BOMs in BigQuery every night, item by item. Classifies each mismatch by cause — failed transfer, manual override, or pending change — and routes it to the right owner with fix instructions. so the PLM Administrator can move the BOM discrepancies between PLM and ERP KPI."
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
provenance_created_at: "2026-07-04T04:05:14.126Z"
---

# BOM PLM-ERP Sync Monitor

> M-5502 • Engineering & PLM

## Overview

- **Persona:** PLM Administrator
- **Department:** manufacturing
- **Objective:** Compares released PTC Windchill PLM structures against SAP S/4HANA PP production BOMs in BigQuery every night, item by item. Classifies each mismatch by cause — failed transfer, manual override, or pending change — and routes it to the right owner with fix instructions. so the PLM Administrator can move the BOM discrepancies between PLM and ERP KPI.

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
