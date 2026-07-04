---
okf_version: "0.1"
type: Knowledge Bundle
title: Penetration Test Findings Tracker
description: "Gemini parses pentest reports automatically and generates Jira tickets with actionable remediation guidance. LLM recommends interim mitigations for findings that cannot be patched immediately (e.g., WAF rules). so the Security Analyst can move the Report-to-ticket time KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/PenTestFindingsTracker.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Penetration Test Findings Tracker

> IT4-07 • Cybersecurity & Threat Management

## Overview

- **Persona:** Security Analyst
- **Department:** it
- **Objective:** Gemini parses pentest reports automatically and generates Jira tickets with actionable remediation guidance. LLM recommends interim mitigations for findings that cannot be patched immediately (e.g., WAF rules). so the Security Analyst can move the Report-to-ticket time KPI.

## KPI summary

- **Report-to-ticket time**: 2-3 days manual → 30 minutes
- **Remediation SLA compliance**: 55% on time → 85% on time
- **Recurring finding rate**: 30% repeat → 10% with pattern tracking

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
