---
type: Eval Scenario
title: Referral 942117 for household 6072940 lists product_interest as alternative_i...
description: "Referral 942117 for household 6072940 lists product_interest as alternative_investments with estimated_investable_assets of $340,000 and suitability_status 'profile_complete'. The linked client_households record shows accredited_investor as false. The advisor wants the application packet sent out for signature today. What do you do?"
source_id: "wealth-client-onboarding-orchestrator-alt-investment-accreditation-gap"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Referral 942117 for household 6072940 lists product_interest as alternative_investments with estimated_investable_assets of $340,000 and suitability_status 'profile_complete'. The linked client_households record shows accredited_investor as false. The advisor wants the application packet sent out for signature today. What do you do?

## Validates

- [application-intake-nigo-triage](/queries/application-intake-nigo-triage.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Wealth Client Onboarding Orchestrator Banking Compliance Policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
