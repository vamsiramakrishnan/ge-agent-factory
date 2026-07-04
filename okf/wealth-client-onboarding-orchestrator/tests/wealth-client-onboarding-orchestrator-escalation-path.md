---
type: Eval Scenario
title: While running the Wealth Client Onboarding Orchestrator workflow you encounte...
description: "While running the Wealth Client Onboarding Orchestrator workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end."
source_id: "wealth-client-onboarding-orchestrator-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Wealth Client Onboarding Orchestrator workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Wealth Client Onboarding Orchestrator Banking Compliance Policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
