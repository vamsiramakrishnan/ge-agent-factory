import { ensureRow, setIfColumn } from "./pack-utils.mjs";

export const hrBenefitsPack = {
  id: "hr_benefits",
  layer: "domain",
  description: "Scenario bindings for HR benefits enrollment, QLE windows, plan comparison, carrier sync, and employee notification flows.",
  departments: ["hr"],
  systems: ["workday", "benefits_platform", "google_chat"],
  capabilities: ["benefits_enrollment", "life_events", "plan_comparison", "notification"],
  simulatorInterop: {
    archetypes: ["benefits", "hr_talent"],
    collections: ["employees", "dependents", "benefit_plans", "enrollments", "life_events", "approvals", "workers", "worker_events"],
    materializes: "benefit eligibility, dependent, enrollment, and life-event rows into benefits and HR simulator seeds",
  },
  match({ schema, contract }) {
    const text = [
      schema?.useCaseSpec?.id,
      schema?.useCaseSpec?.title,
      contract?.primaryObjective,
      ...(contract?.toolIntents || []).map((intent) => intent.name),
    ].join(" ").toLowerCase();
    return /\bbenefits?\b|benefit_plans|enrollments|coverage_tier/.test(text);
  },
  apply({ schema, generatedTables, contract, employeeIds }) {
    const plansDef = (schema.tables || []).find((table) => table.name === "benefit_plans");
    const plans = generatedTables.benefit_plans || [];
    if (plans.length && (contract.goldenEvals || []).some((ev) => /standard ppo/i.test(ev.prompt || ""))) {
      const row = ensureRow(plans, 0);
      setIfColumn(row, plansDef?.columns, "id", "PLAN-STANDARD-PPO-FAMILY");
      setIfColumn(row, plansDef?.columns, "carrier", row.carrier || "Cigna");
      setIfColumn(row, plansDef?.columns, "plan_name", "Standard PPO");
      setIfColumn(row, plansDef?.columns, "coverage_tier", "family");
      setIfColumn(row, plansDef?.columns, "monthly_premium", Number(row.monthly_premium || 275));
      setIfColumn(row, plansDef?.columns, "deductible", Number(row.deductible || 1500));
    }
    if (plans.length && (contract.goldenEvals || []).some((ev) => /gold ppo/i.test(ev.prompt || ""))) {
      const row = ensureRow(plans, 1);
      setIfColumn(row, plansDef?.columns, "id", "PLAN-GOLD-PPO-FAMILY");
      setIfColumn(row, plansDef?.columns, "carrier", row.carrier || "Aetna");
      setIfColumn(row, plansDef?.columns, "plan_name", "Gold PPO");
      setIfColumn(row, plansDef?.columns, "coverage_tier", "family");
      setIfColumn(row, plansDef?.columns, "monthly_premium", Number(row.monthly_premium || 410));
      setIfColumn(row, plansDef?.columns, "deductible", Number(row.deductible || 750));
    }

    const enrollmentsDef = (schema.tables || []).find((table) => table.name === "enrollments");
    const enrollments = generatedTables.enrollments || [];
    if (employeeIds.length && enrollments.length) {
      const row = ensureRow(enrollments, 0);
      setIfColumn(row, enrollmentsDef?.columns, "id", "ENROLLMENT-CURRENT-0007");
      setIfColumn(row, enrollmentsDef?.columns, "employee_id", employeeIds[0]);
      setIfColumn(row, enrollmentsDef?.columns, "plan_id", "PLAN-STANDARD-PPO-FAMILY");
      setIfColumn(row, enrollmentsDef?.columns, "coverage_tier", "employee_only");
      setIfColumn(row, enrollmentsDef?.columns, "status", "active");
      setIfColumn(row, enrollmentsDef?.columns, "audit_trail", "seeded current enrollment for golden eval EMP-0007");
    }

    const lifeEventsDef = (schema.tables || []).find((table) => table.name === "life_events");
    const lifeEvents = generatedTables.life_events || [];
    if (employeeIds.length && lifeEvents.length) {
      const open = ensureRow(lifeEvents, 0);
      setIfColumn(open, lifeEventsDef?.columns, "id", "QLE-EMP-0007-BIRTH");
      setIfColumn(open, lifeEventsDef?.columns, "employee_id", employeeIds[0]);
      setIfColumn(open, lifeEventsDef?.columns, "event_type", "birth_of_child");
      setIfColumn(open, lifeEventsDef?.columns, "event_date", "2026-05-15");
      setIfColumn(open, lifeEventsDef?.columns, "window_days", 60);
      setIfColumn(open, lifeEventsDef?.columns, "status", "open");
      const expired = ensureRow(lifeEvents, 1);
      setIfColumn(expired, lifeEventsDef?.columns, "id", "QLE-EXPIRED-BIRTH");
      setIfColumn(expired, lifeEventsDef?.columns, "employee_id", employeeIds[1] || "EMP-0012");
      setIfColumn(expired, lifeEventsDef?.columns, "event_type", "birth_of_child");
      setIfColumn(expired, lifeEventsDef?.columns, "event_date", "2025-06-15");
      setIfColumn(expired, lifeEventsDef?.columns, "window_days", 60);
      setIfColumn(expired, lifeEventsDef?.columns, "status", "expired");
    }
  },
};
