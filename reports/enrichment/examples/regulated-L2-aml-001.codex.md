You are running an OKF blueprint enrichment shard in GE Agent Factory with Codex.

Use the enriching-okf-blueprints skill if available. Work only within allowed files and do not edit generated docs directly.

Shard manifest:

```json
{
  "schemaVersion": "okf-enrichment-shard.v1",
  "id": "regulated-L2-aml-001",
  "targetStatus": "L4",
  "riskTier": "regulated",
  "specs": [
    {
      "id": "ach-return-root-cause-analyzer",
      "path": "okf/ach-return-root-cause-analyzer",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "common",
        "aml",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "aml-alert-investigation-agent",
      "path": "okf/aml-alert-investigation-agent",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "aml",
        "common",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity",
        "vulnerability-prioritization"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "beneficial-ownership-refresh-agent",
      "path": "okf/beneficial-ownership-refresh-agent",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "aml",
        "common",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "card-dispute-chargeback-orchestrator",
      "path": "okf/card-dispute-chargeback-orchestrator",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "common",
        "aml",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "employee-query-resolution",
      "path": "okf/employee-query-resolution",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "common",
        "aml",
        "fnol-claims",
        "pay-equity",
        "procure-to-pay",
        "ap-three-way-match"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "eod-pnl-attribution-analyzer",
      "path": "okf/eod-pnl-attribution-analyzer",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "common",
        "aml",
        "ap-three-way-match",
        "fnol-claims",
        "loan-covenants",
        "pay-equity"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "fraud-alert-triage-agent",
      "path": "okf/fraud-alert-triage-agent",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "aml",
        "common",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity",
        "vulnerability-prioritization"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "fraud-rule-tuning-analyzer",
      "path": "okf/fraud-rule-tuning-analyzer",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "aml",
        "common",
        "fnol-claims",
        "loan-covenants",
        "ap-three-way-match",
        "pay-equity",
        "vulnerability-prioritization"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "intraday-liquidity-forecasting-engine",
      "path": "okf/intraday-liquidity-forecasting-engine",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "common",
        "aml",
        "ap-three-way-match",
        "fnol-claims",
        "loan-covenants",
        "pay-equity"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    },
    {
      "id": "periodic-kyc-review-orchestrator",
      "path": "okf/periodic-kyc-review-orchestrator",
      "currentStatus": "L2",
      "targetStatus": "L4",
      "domainPacks": [
        "aml",
        "common",
        "ap-three-way-match",
        "fnol-claims",
        "loan-covenants",
        "pay-equity",
        "retail-assortment"
      ],
      "requiredFixes": [
        "happy_path",
        "workflow_failure",
        "missing_evidence",
        "stale_evidence",
        "tool_timeout",
        "tool_parameter_assertion",
        "state_mutation",
        "state_no_mutation",
        "forbidden_tool",
        "hitl_required",
        "hitl_denied",
        "sensitive_data_disclosure",
        "prompt_injection",
        "multi_turn_clarification",
        "multi_turn_changed_facts",
        "multi_turn_impatient_user",
        "domain_invariant"
      ]
    }
  ],
  "allowedFiles": [
    "okf/ach-return-root-cause-analyzer/**",
    "fixtures/ach-return-root-cause-analyzer/**",
    "reports/enrichment/**",
    "domain-packs/aml/**",
    "domain-packs/fnol-claims/**",
    "domain-packs/loan-covenants/**",
    "domain-packs/ap-three-way-match/**",
    "domain-packs/pay-equity/**",
    "okf/aml-alert-investigation-agent/**",
    "fixtures/aml-alert-investigation-agent/**",
    "domain-packs/vulnerability-prioritization/**",
    "okf/beneficial-ownership-refresh-agent/**",
    "fixtures/beneficial-ownership-refresh-agent/**",
    "okf/card-dispute-chargeback-orchestrator/**",
    "fixtures/card-dispute-chargeback-orchestrator/**",
    "okf/employee-query-resolution/**",
    "fixtures/employee-query-resolution/**",
    "domain-packs/procure-to-pay/**",
    "okf/eod-pnl-attribution-analyzer/**",
    "fixtures/eod-pnl-attribution-analyzer/**",
    "okf/fraud-alert-triage-agent/**",
    "fixtures/fraud-alert-triage-agent/**",
    "okf/fraud-rule-tuning-analyzer/**",
    "fixtures/fraud-rule-tuning-analyzer/**",
    "okf/intraday-liquidity-forecasting-engine/**",
    "fixtures/intraday-liquidity-forecasting-engine/**",
    "okf/periodic-kyc-review-orchestrator/**",
    "fixtures/periodic-kyc-review-orchestrator/**",
    "domain-packs/retail-assortment/**"
  ],
  "forbiddenFiles": [
    "packages/**",
    "tools/**",
    "apps/**",
    "docs/generated/**",
    "generated-agents/**"
  ],
  "commands": {
    "preflight": [
      "ge okf quality audit --spec ach-return-root-cause-analyzer --json",
      "ge okf quality audit --spec aml-alert-investigation-agent --json",
      "ge okf quality audit --spec beneficial-ownership-refresh-agent --json",
      "ge okf quality audit --spec card-dispute-chargeback-orchestrator --json",
      "ge okf quality audit --spec employee-query-resolution --json",
      "ge okf quality audit --spec eod-pnl-attribution-analyzer --json",
      "ge okf quality audit --spec fraud-alert-triage-agent --json",
      "ge okf quality audit --spec fraud-rule-tuning-analyzer --json",
      "ge okf quality audit --spec intraday-liquidity-forecasting-engine --json",
      "ge okf quality audit --spec periodic-kyc-review-orchestrator --json"
    ],
    "verify": [
      "ge okf quality audit --spec ach-return-root-cause-analyzer --json",
      "ge okf eval verify --spec ach-return-root-cause-analyzer",
      "ge prove --spec ach-return-root-cause-analyzer --local --no-handoff",
      "ge okf quality audit --spec aml-alert-investigation-agent --json",
      "ge okf eval verify --spec aml-alert-investigation-agent",
      "ge prove --spec aml-alert-investigation-agent --local --no-handoff",
      "ge okf quality audit --spec beneficial-ownership-refresh-agent --json",
      "ge okf eval verify --spec beneficial-ownership-refresh-agent",
      "ge prove --spec beneficial-ownership-refresh-agent --local --no-handoff",
      "ge okf quality audit --spec card-dispute-chargeback-orchestrator --json",
      "ge okf eval verify --spec card-dispute-chargeback-orchestrator",
      "ge prove --spec card-dispute-chargeback-orchestrator --local --no-handoff",
      "ge okf quality audit --spec employee-query-resolution --json",
      "ge okf eval verify --spec employee-query-resolution",
      "ge prove --spec employee-query-resolution --local --no-handoff",
      "ge okf quality audit --spec eod-pnl-attribution-analyzer --json",
      "ge okf eval verify --spec eod-pnl-attribution-analyzer",
      "ge prove --spec eod-pnl-attribution-analyzer --local --no-handoff",
      "ge okf quality audit --spec fraud-alert-triage-agent --json",
      "ge okf eval verify --spec fraud-alert-triage-agent",
      "ge prove --spec fraud-alert-triage-agent --local --no-handoff",
      "ge okf quality audit --spec fraud-rule-tuning-analyzer --json",
      "ge okf eval verify --spec fraud-rule-tuning-analyzer",
      "ge prove --spec fraud-rule-tuning-analyzer --local --no-handoff",
      "ge okf quality audit --spec intraday-liquidity-forecasting-engine --json",
      "ge okf eval verify --spec intraday-liquidity-forecasting-engine",
      "ge prove --spec intraday-liquidity-forecasting-engine --local --no-handoff",
      "ge okf quality audit --spec periodic-kyc-review-orchestrator --json",
      "ge okf eval verify --spec periodic-kyc-review-orchestrator",
      "ge prove --spec periodic-kyc-review-orchestrator --local --no-handoff"
    ]
  },
  "acceptance": {
    "minEvalCount": 20,
    "minMultiTurn": 4,
    "minAdversarial": 4,
    "minStateAssertions": 4,
    "forbidden": [
      "generic_run_workflow_eval",
      "invented_tool_reference",
      "invented_source_system_reference",
      "action_tool_without_state_assertion"
    ]
  }
}
```

Workflow:
1. Run preflight commands from the shard.
2. Inspect each OKF spec and its current quality report.
3. Generate reviewable patches first with `ge okf enrich generate --spec <id> --out .enrichment/patches/<id>.patch.json`.
4. Dry-run apply each patch with `ge okf enrich apply --patch <patch>`.
5. Apply only when the patch stays within allowedFiles and does not invent tools, systems, entities, fields, or authority.
6. Run `ge okf eval verify --spec <id>` and `ge okf quality audit --spec <id> --fail-under <threshold>`.
7. Run proof commands when available.

Hard rules:
- Do not mark specs proven manually.
- Do not bypass hash-bound proof checks.
- Do not add generic evals.
- Every action-tool eval needs expected_state_delta or expected_no_mutation.
- Every new fixture must be referentially consistent.
- If domain detail is insufficient, add needs_expert_review rather than fabricating certainty.

Required final output:
- Changed specs/fixtures/patches.
- Verification commands and results.
- Status movement and remaining blockers.
