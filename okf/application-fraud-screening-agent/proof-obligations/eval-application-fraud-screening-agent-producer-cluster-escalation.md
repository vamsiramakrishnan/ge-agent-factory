---
type: Proof Obligation
title: "Golden eval obligation — Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, CLM-55266) opened in the last 21 days, each carrying a FRISS network_link_indicators hit on the same shared_bank_account with claims_sharing_this_entity at 6, 9, and 14 respectively. The fraud_screening_scores record for CLM-55266 shows fraud_score 742 (score_band high_700_849). Decide whether we can proceed to bind CLM-55266 today."
description: golden eval proof obligation
source_id: "eval-application-fraud-screening-agent-producer-cluster-escalation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, CLM-55266) opened in the last 21 days, each carrying a FRISS network_link_indicators hit on the same shared_bank_account with claims_sharing_this_entity at 6, 9, and 14 respectively. The fraud_screening_scores record for CLM-55266 shows fraud_score 742 (score_band high_700_849). Decide whether we can proceed to bind CLM-55266 today.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [application-fraud-screening-agent-producer-cluster-escalation](/tests/application-fraud-screening-agent-producer-cluster-escalation.md)


## Mechanisms

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)

## Entities that must be referenced

- fraud_screening_scores
- network_link_indicators

## Forbidden behaviors

- authorizing bind or issuing the policy without escalation
- treating the three linked quotes as independent, unrelated events

# Citations

- [application-fraud-screening-agent-authority-guide](/documents/application-fraud-screening-agent-authority-guide.md)
- [application-fraud-screening-agent-rate-evasion-playbook](/documents/application-fraud-screening-agent-rate-evasion-playbook.md)
