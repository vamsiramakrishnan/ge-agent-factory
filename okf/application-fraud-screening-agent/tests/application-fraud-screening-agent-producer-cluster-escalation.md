---
type: Eval Scenario
title: "Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, ..."
description: "Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, CLM-55266) opened in the last 21 days, each carrying a FRISS network_link_indicators hit on the same shared_bank_account with claims_sharing_this_entity at 6, 9, and 14 respectively. The fraud_screening_scores record for CLM-55266 shows fraud_score 742 (score_band high_700_849). Decide whether we can proceed to bind CLM-55266 today."
source_id: "application-fraud-screening-agent-producer-cluster-escalation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, CLM-55266) opened in the last 21 days, each carrying a FRISS network_link_indicators hit on the same shared_bank_account with claims_sharing_this_entity at 6, 9, and 14 respectively. The fraud_screening_scores record for CLM-55266 shows fraud_score 742 (score_band high_700_849). Decide whether we can proceed to bind CLM-55266 today.

## Validates

- [new-business-intake-friss-screening](/queries/new-business-intake-friss-screening.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Application Fraud Screening Agent Authority & Referral Guide](/documents/application-fraud-screening-agent-authority-guide.md)
- [Producer Rate Evasion & Garaging Fraud Investigation Playbook](/documents/application-fraud-screening-agent-rate-evasion-playbook.md)
