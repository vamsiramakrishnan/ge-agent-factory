---
okf_version: "0.1"
type: Knowledge Bundle
title: "Goods Receipt & Service Entry Validator"
description: "IoT/RFID data automatically cross-referenced against PO quantities with anomaly detection on variances. LLM validates service entry sheets against actual SOW — confirms that 'section 4.2 deliverables' (documents, reviews, sign-offs) were met. so the Buyer can move the GR discrepancy detection KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/GoodsReceiptValidator.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Goods Receipt & Service Entry Validator

> A-1508 • Procure-to-Pay

## Overview

- **Persona:** Buyer
- **Department:** procurement
- **Objective:** IoT/RFID data automatically cross-referenced against PO quantities with anomaly detection on variances. LLM validates service entry sheets against actual SOW — confirms that 'section 4.2 deliverables' (documents, reviews, sign-offs) were met. so the Buyer can move the GR discrepancy detection KPI.

## KPI summary

- **GR discrepancy detection**: Manual spot checks → 100% automated
- **Service validation time**: 3-5 days → Same day
- **False GR confirmations**: 12% undetected → <2%

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
