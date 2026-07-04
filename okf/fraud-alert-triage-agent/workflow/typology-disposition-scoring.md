---
type: Workflow Stage
title: "Typology & Disposition Scoring"
description: "Classify the alert_type (card_not_present, account_takeover, elder_financial_exploitation, business_email_compromise_wire, p2p_payment_scam, check_kiting, counterfeit_check) against amount_at_risk and reg_e_claim_filed to determine whether the pattern is a well-understood benign false_positive, needs investigation_cases opened, or trips a hard escalation gate."
source_id: typology_disposition_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Typology & Disposition Scoring

Classify the alert_type (card_not_present, account_takeover, elder_financial_exploitation, business_email_compromise_wire, p2p_payment_scam, check_kiting, counterfeit_check) against amount_at_risk and reg_e_claim_filed to determine whether the pattern is a well-understood benign false_positive, needs investigation_cases opened, or trips a hard escalation gate.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Policy & Evidence Gating](/workflow/policy-evidence-gating.md)
