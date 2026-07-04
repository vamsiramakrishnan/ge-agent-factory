---
okf_version: "0.1"
type: Knowledge Bundle
title: Feature Flag Manager
description: "Gemini identifies stale flags with evidence of successful rollout, generating cleanup PRs with impact analysis. Rollout health monitoring via Datadog catches negative flag impacts within hours, not sprint retrospectives. so the DevOps Lead can move the Stale flags in production KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/FeatureFlagManager.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Feature Flag Manager

> A-3907 • Software Engineering & DevOps

## Overview

- **Persona:** DevOps Lead
- **Department:** it
- **Objective:** Gemini identifies stale flags with evidence of successful rollout, generating cleanup PRs with impact analysis. Rollout health monitoring via Datadog catches negative flag impacts within hours, not sprint retrospectives. so the DevOps Lead can move the Stale flags in production KPI.

## KPI summary

- **Stale flags in production**: 50+ (no tracking) → <5 at any time
- **Flag cleanup cycle**: Never (accumulate) → Weekly automated
- **Rollout impact visibility**: None → Real-time metrics

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
