---
type: Workflow Stage
title: "Suitability, Reg BI & accreditation verification"
description: "Check advisory_referrals suitability_status, investment_time_horizon, and liquidity_needs against the linked client_households risk_tolerance, investment_objective, and accredited_investor flag, citing the Wealth Client Onboarding Orchestrator Banking Compliance Policy before clearing a packet to fund."
source_id: suitability_reg_bi_accreditation_verification
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Suitability, Reg BI & accreditation verification

Check advisory_referrals suitability_status, investment_time_horizon, and liquidity_needs against the linked client_households risk_tolerance, investment_objective, and accredited_investor flag, citing the Wealth Client Onboarding Orchestrator Banking Compliance Policy before clearing a packet to fund.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)

Next: [ACAT / custodian transfer tracking](/workflow/acat-custodian-transfer-tracking.md)
