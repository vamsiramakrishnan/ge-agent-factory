---
type: Eval Scenario
title: "Household 6087345 (total_aum $9,000,000, accredited_investor = false) has adv..."
description: "Household 6087345 (total_aum $9,000,000, accredited_investor = false) has advisory_referrals record referral_id 942117 proposing a structured_note position of $920,000 against account 84455621 — roughly 10.2% of household AUM. Confirm whether this next best action can be recommended today, and if not, what's the path."
source_id: "advisor-next-best-action-engine-concentration-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6087345 (total_aum $9,000,000, accredited_investor = false) has advisory_referrals record referral_id 942117 proposing a structured_note position of $920,000 against account 84455621 — roughly 10.2% of household AUM. Confirm whether this next best action can be recommended today, and if not, what's the path.

## Validates

- [suitability-concentration-screen](/queries/suitability-concentration-screen.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Advisor Next Best Action Engine Banking Compliance Policy](/documents/advisor-next-best-action-engine-compliance-policy.md)
- [Reg BI Rollover Suitability & Concentration Playbook](/documents/reg-bi-rollover-suitability-playbook.md)
