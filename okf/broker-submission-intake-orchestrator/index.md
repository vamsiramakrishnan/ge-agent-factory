---
okf_version: "0.1"
type: Knowledge Bundle
title: Broker Submission Intake Orchestrator
description: "Parses ACORD forms, loss runs, and SOV spreadsheets and creates structured submission records in Duck Creek Policy automatically. Detects missing or inconsistent fields and generates a single consolidated information request to the broker, including a DocuSign envelope for unsigned forms. so the Underwriting Assistant can move the Submission data entry time KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/broker-submission-intake-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:53.105Z"
---

# Broker Submission Intake Orchestrator

> I-3102 • Distribution & Underwriting

## Overview

- **Persona:** Underwriting Assistant
- **Department:** insurance
- **Objective:** Parses ACORD forms, loss runs, and SOV spreadsheets and creates structured submission records in Duck Creek Policy automatically. Detects missing or inconsistent fields and generates a single consolidated information request to the broker, including a DocuSign envelope for unsigned forms. so the Underwriting Assistant can move the Submission data entry time KPI.

## KPI summary

- **Submission data entry time**: 45 min per submission → 4 min per submission
- **Missing-information follow-up cycles**: 2.7 per submission → 0.8 per submission
- **Intake data accuracy**: 91% → 99.2%

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
