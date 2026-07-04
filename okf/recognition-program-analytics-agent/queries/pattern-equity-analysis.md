---
type: Query Capability
title: "Analyze recognition patterns across teams, demographics, levels, and time per..."
description: "Analyze recognition patterns across teams, demographics, levels, and time periods. Detect equity gaps and identify under-recognized populations using statistical methods."
source_id: "pattern-equity-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze recognition patterns across teams, demographics, levels, and time periods. Detect equity gaps and identify under-recognized populations using statistical methods.

## Tools used

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_program_analytics_agent_policy_handbook](/tools/lookup-recognition-program-analytics-agent-policy-handbook.md)
- [action_recognition_platform_execute](/tools/action-recognition-platform-execute.md)

## Runs in

- [pattern_equity_analysis](/workflow/pattern-equity-analysis.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-program-analytics-agent-end-to-end.md)

# Citations

- [Recognition Program Analytics Agent Policy Handbook](/documents/recognition-program-analytics-agent-policy-handbook.md)
