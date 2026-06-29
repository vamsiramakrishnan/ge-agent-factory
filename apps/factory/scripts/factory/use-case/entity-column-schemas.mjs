const COMMON_ENTITY_VALUES = {
  departments: [
    "HR",
    "Finance",
    "IT",
    "Operations",
    "Marketing",
    "Engineering",
  ],
  regions: ["US", "EMEA", "APAC", "LATAM"],
  benefitCarriers: ["Aetna", "Cigna", "UnitedHealthcare", "Kaiser"],
  coverageTiers: ["employee_only", "employee_spouse", "family"],
};

function idColumn(systemPrefix) {
  return { name: "id", type: "seq", pattern: `${systemPrefix}-{n:4}` };
}

function sourceRecordColumn(systemPrefix, suffix = "REC") {
  return {
    name: "source_record_id",
    type: "seq",
    pattern: `${systemPrefix}-${suffix}-{n:4}`,
  };
}

const ENTITY_COLUMN_SCHEMAS = [
  {
    id: "people",
    matches: ["employee", "staff", "worker"],
    columns: ({ idCol, systemPrefix }) => [
      idCol,
      sourceRecordColumn(systemPrefix),
      { name: "name", type: "person.fullName" },
      { name: "email", type: "internet.email" },
      {
        name: "department",
        type: "enum",
        values: COMMON_ENTITY_VALUES.departments,
      },
      { name: "region", type: "enum", values: COMMON_ENTITY_VALUES.regions },
      {
        name: "status",
        type: "enum",
        values: ["active", "inactive", "on_leave"],
        weights: [0.8, 0.1, 0.1],
      },
      { name: "level", type: "enum", values: ["L3", "L4", "L5", "L6", "L7"] },
      { name: "hire_date", type: "date", min: "2018-01-01", max: "2026-01-01" },
      { name: "salary", type: "number", min: 55000, max: 180000 },
      {
        name: "life_event",
        type: "enum",
        values: [
          "none",
          "birth_of_child",
          "marriage",
          "move",
          "loss_of_coverage",
        ],
        weights: [0.7, 0.1, 0.08, 0.07, 0.05],
      },
      { name: "dependents", type: "number", min: 0, max: 4 },
    ],
  },
  {
    id: "benefit-plans",
    matches: ["benefit_plan", "plan"],
    columns: ({ idCol }) => [
      idCol,
      {
        name: "carrier",
        type: "enum",
        values: COMMON_ENTITY_VALUES.benefitCarriers,
      },
      {
        name: "plan_name",
        type: "enum",
        values: ["Gold PPO", "Standard PPO", "Silver HMO", "Bronze HSA"],
      },
      {
        name: "coverage_tier",
        type: "enum",
        values: COMMON_ENTITY_VALUES.coverageTiers,
      },
      { name: "monthly_premium", type: "number", min: 50, max: 450 },
      { name: "deductible", type: "number", min: 500, max: 6000 },
      { name: "network_type", type: "enum", values: ["ppo", "hmo", "hdhp"] },
      {
        name: "eligible_regions",
        type: "enum",
        values: ["US", "US_CA", "US_NY", "US_ALL"],
      },
      {
        name: "status",
        type: "enum",
        values: ["active", "retired"],
        weights: [0.9, 0.1],
      },
    ],
  },
  {
    id: "enrollments",
    matches: ["enrollment"],
    columns: ({ idCol, systemPrefix }) => [
      idCol,
      { name: "employee_id", type: "ref", ref: "employees.id" },
      { name: "plan_id", type: "ref", ref: "benefit_plans.id" },
      {
        name: "coverage_tier",
        type: "enum",
        values: COMMON_ENTITY_VALUES.coverageTiers,
      },
      {
        name: "effective_date",
        type: "date",
        min: "2025-01-01",
        max: "2026-12-31",
      },
      {
        name: "status",
        type: "enum",
        values: ["active", "pending_carrier_sync", "waived", "terminated"],
      },
      {
        name: "life_event",
        type: "enum",
        values: ["open_enrollment", "birth_of_child", "marriage", "new_hire"],
      },
      sourceRecordColumn(systemPrefix, "ENR"),
      { name: "audit_trail", type: "lorem.sentence" },
    ],
  },
  {
    id: "eligibility",
    matches: ["eligibility"],
    columns: ({ idCol }) => [
      idCol,
      {
        name: "rule_name",
        type: "enum",
        values: [
          "US active employee",
          "New hire waiting period",
          "Life event window",
          "Family tier eligibility",
        ],
      },
      { name: "employee_status", type: "enum", values: ["active", "on_leave"] },
      { name: "region", type: "enum", values: ["US", "EMEA", "APAC"] },
      { name: "waiting_days", type: "number", min: 0, max: 30 },
      { name: "life_event_window_days", type: "number", min: 30, max: 60 },
      { name: "requires_documentation", type: "boolean", trueRate: 0.35 },
    ],
  },
  {
    id: "carrier-sync",
    matches: ["carrier_sync"],
    columns: ({ idCol, systemPrefix }) => [
      idCol,
      { name: "enrollment_id", type: "ref", ref: "enrollments.id" },
      {
        name: "carrier",
        type: "enum",
        values: COMMON_ENTITY_VALUES.benefitCarriers,
      },
      {
        name: "sync_status",
        type: "enum",
        values: ["queued", "sent", "confirmed", "failed"],
        weights: [0.2, 0.35, 0.4, 0.05],
      },
      { name: "sync_date", type: "date", min: "2025-01-01", max: "2026-12-31" },
      sourceRecordColumn(systemPrefix, "SYNC"),
      { name: "error_message", type: "lorem.sentence" },
    ],
  },
  {
    id: "financial-transactions",
    matches: ["transaction", "gl_entr", "journal"],
    columns: ({ idCol }) => [
      idCol,
      { name: "date", type: "date", min: "2024-01-01", max: "2026-06-01" },
      {
        name: "account",
        type: "enum",
        values: [
          "1000-Cash",
          "2000-AP",
          "3000-Revenue",
          "4000-Expense",
          "5000-COGS",
        ],
      },
      { name: "amount", type: "float", min: -50000, max: 50000, decimals: 2 },
      { name: "currency", type: "enum", values: ["USD", "EUR", "GBP"] },
      { name: "description", type: "lorem.sentence" },
      {
        name: "status",
        type: "enum",
        values: ["posted", "pending", "reversed"],
        weights: [0.8, 0.15, 0.05],
      },
    ],
  },
  {
    id: "service-work",
    matches: ["ticket", "incident", "request", "case"],
    columns: ({ idCol }) => [
      idCol,
      { name: "title", type: "lorem.sentence" },
      {
        name: "priority",
        type: "enum",
        values: ["P1", "P2", "P3", "P4"],
        weights: [0.05, 0.15, 0.4, 0.4],
      },
      {
        name: "status",
        type: "enum",
        values: ["open", "in_progress", "resolved", "closed"],
        weights: [0.2, 0.3, 0.3, 0.2],
      },
      { name: "assignee", type: "person.fullName" },
      {
        name: "created_date",
        type: "date",
        min: "2025-01-01",
        max: "2026-06-01",
      },
      {
        name: "category",
        type: "enum",
        values: ["access", "hardware", "software", "network", "policy"],
      },
      { name: "sla_met", type: "boolean", trueRate: 0.78 },
    ],
  },
  {
    id: "vendors",
    matches: ["vendor", "supplier"],
    columns: ({ idCol }) => [
      idCol,
      { name: "name", type: "company.name" },
      {
        name: "category",
        type: "enum",
        values: [
          "IT",
          "Consulting",
          "Manufacturing",
          "Logistics",
          "Facilities",
        ],
      },
      { name: "rating", type: "number", min: 1, max: 5 },
      { name: "contract_value", type: "number", min: 10000, max: 500000 },
      {
        name: "risk_score",
        type: "enum",
        values: ["low", "medium", "high"],
        weights: [0.5, 0.35, 0.15],
      },
      {
        name: "contract_start",
        type: "date",
        min: "2022-01-01",
        max: "2026-01-01",
      },
    ],
  },
  {
    id: "procurement-documents",
    matches: ["purchase_order", "requisition", "invoice"],
    columns: ({ idCol }) => [
      idCol,
      { name: "vendor", type: "company.name" },
      { name: "amount", type: "float", min: 500, max: 100000, decimals: 2 },
      { name: "date", type: "date", min: "2024-06-01", max: "2026-06-01" },
      {
        name: "status",
        type: "enum",
        values: ["pending", "approved", "rejected", "completed"],
        weights: [0.2, 0.4, 0.1, 0.3],
      },
      {
        name: "category",
        type: "enum",
        values: ["services", "hardware", "software", "facilities"],
      },
      { name: "approver", type: "person.fullName" },
    ],
  },
  {
    id: "marketing",
    matches: ["campaign", "lead"],
    columns: ({ idCol }) => [
      idCol,
      { name: "name", type: "commerce.product" },
      {
        name: "channel",
        type: "enum",
        values: ["email", "social", "search", "display", "event"],
      },
      { name: "budget", type: "number", min: 5000, max: 200000 },
      { name: "spend", type: "float", min: 1000, max: 180000, decimals: 2 },
      { name: "impressions", type: "number", min: 1000, max: 500000 },
      { name: "conversions", type: "number", min: 10, max: 5000 },
      {
        name: "start_date",
        type: "date",
        min: "2025-01-01",
        max: "2026-06-01",
      },
    ],
  },
  {
    id: "performance",
    matches: ["review", "feedback", "goal"],
    columns: ({ idCol }) => [
      idCol,
      { name: "employee_id", type: "ref", ref: "employees.id" },
      { name: "reviewer", type: "person.fullName" },
      { name: "score", type: "float", min: 1.0, max: 5.0, decimals: 1 },
      {
        name: "cycle",
        type: "enum",
        values: ["Q1-2025", "Q2-2025", "Q3-2025", "Q4-2025", "Q1-2026"],
      },
      { name: "comments", type: "lorem.paragraph" },
      {
        name: "status",
        type: "enum",
        values: ["draft", "submitted", "acknowledged"],
        weights: [0.1, 0.6, 0.3],
      },
    ],
  },
  {
    id: "documents",
    matches: ["document", "polic", "audit"],
    columns: ({ idCol }) => [
      idCol,
      { name: "title", type: "lorem.sentence" },
      {
        name: "type",
        type: "enum",
        values: [
          "policy",
          "procedure",
          "audit_report",
          "compliance_doc",
          "training_material",
        ],
      },
      { name: "author", type: "person.fullName" },
      {
        name: "created_date",
        type: "date",
        min: "2023-01-01",
        max: "2026-06-01",
      },
      { name: "version", type: "enum", values: ["1.0", "1.1", "2.0", "3.0"] },
      { name: "content_preview", type: "lorem.paragraph" },
    ],
  },
  {
    id: "messages",
    matches: ["message", "notification", "thread", "space"],
    columns: ({ idCol, systemPrefix }) => [
      idCol,
      {
        name: "channel",
        type: "enum",
        values: ["google_chat", "slack", "email"],
      },
      { name: "recipient", type: "internet.email" },
      { name: "subject", type: "lorem.sentence" },
      { name: "body", type: "lorem.paragraph" },
      { name: "sent_at", type: "date", min: "2025-01-01", max: "2026-12-31" },
      {
        name: "status",
        type: "enum",
        values: ["draft", "sent", "delivered", "failed"],
      },
      sourceRecordColumn(systemPrefix, "MSG"),
    ],
  },
  {
    id: "metrics",
    matches: ["metric", "analytic", "dashboard", "historical"],
    columns: ({ idCol }) => [
      idCol,
      {
        name: "metric_name",
        type: "enum",
        values: [
          "utilization",
          "cost_per_unit",
          "cycle_time",
          "error_rate",
          "throughput",
          "satisfaction_score",
        ],
      },
      { name: "value", type: "float", min: 0, max: 100, decimals: 2 },
      { name: "period", type: "date", min: "2024-01-01", max: "2026-06-01" },
      {
        name: "department",
        type: "enum",
        values: ["HR", "Finance", "IT", "Operations"],
      },
      {
        name: "trend",
        type: "enum",
        values: ["up", "down", "flat"],
        weights: [0.4, 0.3, 0.3],
      },
    ],
  },
];

export function matchEntityColumnSchema(entityName) {
  const name = entityName.toLowerCase();
  return (
    ENTITY_COLUMN_SCHEMAS.find((schema) =>
      schema.matches.some((needle) => name.includes(needle)),
    ) || null
  );
}

export function deriveColumnsForEntity(entityName, systemPrefix) {
  const idCol = idColumn(systemPrefix);
  const schema = matchEntityColumnSchema(entityName);
  if (schema) return schema.columns({ idCol, systemPrefix });
  return [
    idCol,
    { name: "name", type: "string" },
    { name: "value", type: "number", min: 1, max: 1000 },
    { name: "status", type: "enum", values: ["active", "inactive", "pending"] },
    { name: "created_at", type: "date", min: "2024-01-01", max: "2026-06-01" },
    { name: "notes", type: "lorem.sentence" },
  ];
}
