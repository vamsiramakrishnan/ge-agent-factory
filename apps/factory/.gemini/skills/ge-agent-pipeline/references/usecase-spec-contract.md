# Use Case Spec Contract

Load this when creating, validating, or repairing generated workspaces from slide use cases.

Every generated workspace must include `mock_systems/usecase-spec.json`. This is the contract that prevents generic fixture drift and hello-world agents.

Required shape:

```json
{
  "id": "BenefitsAssistant",
  "title": "Benefits Q&A & Enrollment",
  "department": "hr",
  "rowPolicy": {
    "requestedRows": 48,
    "minimumRowsPerEntity": 25,
    "defaultRowsPerEntity": 48
  },
  "systems": [
    {
      "id": "workday",
      "name": "Workday",
      "kind": "api",
      "protocol": "REST API",
      "direction": "read",
      "responsibility": "Employee eligibility, dependents, life events, and HR source records"
    }
  ],
  "dataContracts": [
    {
      "entity": "employees",
      "sourceSystem": "Workday",
      "sourceSystemId": "workday",
      "sourceKind": "api",
      "rows": 48,
      "primaryKey": "id",
      "columns": [
        {"name": "id", "type": "seq", "required": true},
        {"name": "source_record_id", "type": "seq", "required": true}
      ]
    }
  ],
  "evidenceRequired": ["sql_result", "source_system_record", "generated_audit_trail"],
  "behaviorContract": {
    "role": "Benefits enrollment copilot for active employees",
    "primaryObjective": "Answer benefits questions with cited source-system evidence and submit eligible enrollment changes only after validating employee, plan, and life-event records.",
    "inScope": ["Plan comparison", "Qualified life event enrollment", "Employee notification"],
    "outOfScope": ["Medical advice", "Changing payroll or compensation"],
    "toolIntents": [
      {
        "name": "query_workday_employees",
        "kind": "query",
        "sourceSystemId": "workday",
        "description": "Resolve employee profile, region, dependents, and active life event.",
        "requiredInputs": ["employee_id"],
        "produces": ["employee_record"],
        "evidenceEmitted": ["source_system_record"]
      },
      {
        "name": "action_benefits_platform_enroll",
        "kind": "action",
        "sourceSystemId": "benefits_platform",
        "description": "Submit an eligible enrollment change and return enrollment_id, carrier_sync_id, and audit_trail.",
        "requiredInputs": ["employee_id", "plan_id", "coverage_tier"],
        "produces": ["enrollment_id", "carrier_sync_id", "audit_trail"],
        "evidenceEmitted": ["api_response", "generated_audit_trail"]
      }
    ],
    "evidenceRequirements": [
      {"claim": "employee is eligible", "mustCite": ["employees.region", "eligibility-window"], "sourceSystemIds": ["workday", "benefits_platform"]}
    ],
    "escalationRules": [
      {"trigger": "missing or ambiguous employee_id", "action": "request_more_info", "rationale": "Never guess identity or identifiers."}
    ],
    "refusalRules": ["Never invent IDs, plan values, policy citations, or action outcomes."],
    "goldenEvals": [
      {"id": "eligible-enrollment", "prompt": "I just had a baby; compare family plans and enroll me.", "expectedToolCalls": ["query_workday_employees", "action_benefits_platform_enroll"]}
    ]
  },
  "documentRequirements": [
    "Every document has source system, linked entity IDs, and citation anchors."
  ],
  "integrityRules": [
    "Every foreign key references an existing generated row."
  ]
}
```

Rules:

- Use business system names in the spec and tool names: `Workday`, `Benefits Platform`, `Google Chat`.
- Generated ADK functions must reflect those systems, for example `query_workday_employees`, not `query_mock_employees`.
- `behaviorContract` is required for production-grade generation. If it is `null`, stop and enrich the upstream TSX slide before creating the ADK agent.
- Behavior tool intents are canonical. Action, notification, evidence lookup, and calculation intents must become generated Python tools with the same names.
- `agent.py` instructions must include the role, primary objective, evidence requirements, escalation/refusal rules, and response contract from `behaviorContract`.
- Golden evals must be emitted under `evals/golden.json` and covered by smoke tests.
- A fixture table without `sourceSystem` and `sourceSystemId` is invalid.
- Row counts must be deliberate. Use at least 25 rows per transactional entity unless the use case explicitly needs a small reference table.
- Documents must contain specific policy, plan, contract, or workflow content. Title-only or lorem-only documents are invalid.
- Referential integrity is mandatory for `ref` columns.
