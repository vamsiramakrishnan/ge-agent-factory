---
type: Query Capability
title: "Cross-reference the scored accounts against Salesforce Marketing Cloud accoun..."
description: "Cross-reference the scored accounts against Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records to select the channel most likely to reach the policyholder and suppress accounts already inside an active, engaged dunning or card-update campaign."
source_id: "channel-eligibility-campaign-suppression"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference the scored accounts against Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records to select the channel most likely to reach the policyholder and suppress accounts already inside an active, engaged dunning or card-update campaign.

## Tools used

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)

## Runs in

- [channel_eligibility_campaign_suppression](/workflow/channel-eligibility-campaign-suppression.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Premium Delinquency Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/premium-delinquency-outreach-agent-end-to-end.md)
- [Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?](/tests/premium-delinquency-outreach-agent-plan-status-conflict.md)
- [Billing account BA-2024-204471 has autopay_eft_enrolled = true but nsf_returns_last_12mo = 2, with the most recent NSF on 2026-06-30 and a current_balance of $3,120.40. The nightly BigQuery cure-probability refresh for this account last completed 2026-07-01T22:00:00Z (over 33 hours ago) and currently scores it high-cure-probability, low-priority. The dunning campaign wants to skip the card-update prompt, auto-re-enroll the account in autopay using the card on file, and close it out as self-cured. Walk through whether this is compliant.](/tests/premium-delinquency-outreach-agent-autopay-failure-stale-score.md)

# Citations

- [Premium Delinquency Outreach Agent Authority & Referral Guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)
- [Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook](/documents/premium-delinquency-outreach-agent-cancellation-notice-dunning-playbook.md)
