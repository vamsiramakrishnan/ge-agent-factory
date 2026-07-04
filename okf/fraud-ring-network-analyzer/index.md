---
okf_version: "0.1"
type: Knowledge Bundle
title: Fraud Ring Network Analyzer
description: "Builds entity-resolution graphs across claims, providers, and participants nightly in BigQuery, enriched with LexisNexis identity data. Detects suspicious clusters — shared identifiers, provider billing patterns, choreographed loss sequences — and scores them for organized activity. so the SIU Manager can move the Organized fraud rings identified per year KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fraud-ring-network-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:03.595Z"
---

# Fraud Ring Network Analyzer

> I-3602 • Fraud, SIU & Compliance

## Overview

- **Persona:** SIU Manager
- **Department:** insurance
- **Objective:** Builds entity-resolution graphs across claims, providers, and participants nightly in BigQuery, enriched with LexisNexis identity data. Detects suspicious clusters — shared identifiers, provider billing patterns, choreographed loss sequences — and scores them for organized activity. so the SIU Manager can move the Organized fraud rings identified per year KPI.

## KPI summary

- **Organized fraud rings identified per year**: 3 → 14
- **Average ring exposure at detection**: $2.1M → $0.5M
- **Cross-claim link discovery time**: weeks of manual research → hours

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
