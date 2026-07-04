---
type: Workflow Stage
title: "Recommend & Stage for Approval"
description: "Execute action_ericsson_network_manager_recommend against Ericsson Network Manager with a full audit trail, staging the tilt/power/mobility change for RF Optimization Engineer sign-off."
source_id: recommend_stage_for_approval
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recommend & Stage for Approval

Execute action_ericsson_network_manager_recommend against Ericsson Network Manager with a full audit trail, staging the tilt/power/mobility change for RF Optimization Engineer sign-off.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)
- [action_ericsson_network_manager_recommend](/tools/action-ericsson-network-manager-recommend.md)

Next: [Post-Change Verification & Rollback](/workflow/post-change-verification-rollback.md)
