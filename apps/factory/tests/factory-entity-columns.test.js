import { test, expect } from "bun:test";
import {
  deriveColumnsForEntity,
  matchEntityColumnSchema,
} from "../scripts/factory/use-case/entity-column-schemas.mjs";

const EXPECTED_COLUMN_NAMES = [
  [
    "employees",
    "WD",
    "people",
    [
      "id",
      "source_record_id",
      "name",
      "email",
      "department",
      "region",
      "status",
      "level",
      "hire_date",
      "salary",
      "life_event",
      "dependents",
    ],
  ],
  [
    "benefit_plans",
    "BEN",
    "benefit-plans",
    [
      "id",
      "carrier",
      "plan_name",
      "coverage_tier",
      "monthly_premium",
      "deductible",
      "network_type",
      "eligible_regions",
      "status",
    ],
  ],
  [
    "enrollments",
    "BEN",
    "enrollments",
    [
      "id",
      "employee_id",
      "plan_id",
      "coverage_tier",
      "effective_date",
      "status",
      "life_event",
      "source_record_id",
      "audit_trail",
    ],
  ],
  [
    "eligibility_rules",
    "BEN",
    "eligibility",
    [
      "id",
      "rule_name",
      "employee_status",
      "region",
      "waiting_days",
      "life_event_window_days",
      "requires_documentation",
    ],
  ],
  [
    "carrier_sync_events",
    "BEN",
    "carrier-sync",
    [
      "id",
      "enrollment_id",
      "carrier",
      "sync_status",
      "sync_date",
      "source_record_id",
      "error_message",
    ],
  ],
  [
    "transactions",
    "SAP",
    "financial-transactions",
    ["id", "date", "account", "amount", "currency", "description", "status"],
  ],
  [
    "tickets",
    "SN",
    "service-work",
    [
      "id",
      "title",
      "priority",
      "status",
      "assignee",
      "created_date",
      "category",
      "sla_met",
    ],
  ],
  [
    "vendors",
    "SAP",
    "vendors",
    [
      "id",
      "name",
      "category",
      "rating",
      "contract_value",
      "risk_score",
      "contract_start",
    ],
  ],
  [
    "purchase_orders",
    "CP",
    "procurement-documents",
    ["id", "vendor", "amount", "date", "status", "category", "approver"],
  ],
  [
    "campaigns",
    "MK",
    "marketing",
    [
      "id",
      "name",
      "channel",
      "budget",
      "spend",
      "impressions",
      "conversions",
      "start_date",
    ],
  ],
  [
    "reviews",
    "LT",
    "performance",
    ["id", "employee_id", "reviewer", "score", "cycle", "comments", "status"],
  ],
  [
    "documents",
    "SP",
    "documents",
    [
      "id",
      "title",
      "type",
      "author",
      "created_date",
      "version",
      "content_preview",
    ],
  ],
  [
    "messages",
    "SL",
    "messages",
    [
      "id",
      "channel",
      "recipient",
      "subject",
      "body",
      "sent_at",
      "status",
      "source_record_id",
    ],
  ],
  [
    "metrics",
    "BQ",
    "metrics",
    ["id", "metric_name", "value", "period", "department", "trend"],
  ],
  [
    "custom_records",
    "GEN",
    null,
    ["id", "name", "value", "status", "created_at", "notes"],
  ],
];

test.each(EXPECTED_COLUMN_NAMES)(
  "derives %s columns through ordered schema lookup",
  (entityName, systemPrefix, schemaId, expectedNames) => {
    expect(matchEntityColumnSchema(entityName)?.id ?? null).toBe(schemaId);
    const columns = deriveColumnsForEntity(entityName, systemPrefix);
    expect(columns.map((column) => column.name)).toEqual(expectedNames);
    expect(columns[0]).toEqual({
      name: "id",
      type: "seq",
      pattern: `${systemPrefix}-{n:4}`,
    });
  },
);

test("entity column schemas preserve first-match behavior for plan documents", () => {
  expect(matchEntityColumnSchema("plan_documents")?.id).toBe("benefit-plans");
  expect(
    deriveColumnsForEntity("plan_documents", "GD").map((column) => column.name),
  ).toEqual([
    "id",
    "carrier",
    "plan_name",
    "coverage_tier",
    "monthly_premium",
    "deductible",
    "network_type",
    "eligible_regions",
    "status",
  ]);
});

test("source record helper preserves per-entity prefixes", () => {
  expect(
    deriveColumnsForEntity("employees", "WD").find(
      (column) => column.name === "source_record_id",
    ),
  ).toEqual({
    name: "source_record_id",
    type: "seq",
    pattern: "WD-REC-{n:4}",
  });
  expect(
    deriveColumnsForEntity("enrollments", "BEN").find(
      (column) => column.name === "source_record_id",
    ),
  ).toEqual({
    name: "source_record_id",
    type: "seq",
    pattern: "BEN-ENR-{n:4}",
  });
});
