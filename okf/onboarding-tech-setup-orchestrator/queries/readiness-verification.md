---
type: Query Capability
title: "Run automated checks: all Okta apps accessible, email active, Slack channels ..."
description: "Run automated checks: all Okta apps accessible, email active, Slack channels joined, device enrolled and patched. Generate readiness scorecard for IT verification."
source_id: "readiness-verification"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run automated checks: all Okta apps accessible, email active, Slack channels joined, device enrolled and patched. Generate readiness scorecard for IT verification.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)

## Runs in

- [readiness_verification](/workflow/readiness-verification.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-tech-setup-orchestrator-end-to-end.md)

# Citations

- [Onboarding Tech Setup Orchestrator Operations Runbook](/documents/onboarding-tech-setup-orchestrator-runbook.md)
