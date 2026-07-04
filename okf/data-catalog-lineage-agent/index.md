---
okf_version: "0.1"
type: Knowledge Bundle
title: "Data Catalog & Lineage Agent"
description: "Gemini answers data discovery questions in natural language with provenance and quality context. LLM warns against using staging tables directly — 'use dwh.dim_customer, not staging.raw_orders.' so the Data Platform Lead can move the Data discovery time KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/DataCatalogLineageAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Data Catalog & Lineage Agent

> IT6-06 • Data & AI Platform

## Overview

- **Persona:** Data Platform Lead
- **Department:** it
- **Objective:** Gemini answers data discovery questions in natural language with provenance and quality context. LLM warns against using staging tables directly — 'use dwh.dim_customer, not staging.raw_orders.' so the Data Platform Lead can move the Data discovery time KPI.

## KPI summary

- **Data discovery time**: Hours of asking teams → Minutes via chat
- **Catalog coverage**: 30% documented → 95% auto-cataloged
- **PII classification**: Manual audit annually → Automated continuous

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
