import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

function seedTalentTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "closed", "active"][index]);
    setIfColumn(row, tableDef.columns, "owner", ["Talent Ops", "Recruiting Lead", "Learning Admin", "Hiring Manager"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(11 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with candidate, training, scorecard, or completion evidence for talent workflow evaluation.`);
  });
}

export const learningTalentPack = {
  id: "system_learning_talent",
  layer: "system",
  description: "Common learning, recruiting, and talent recipe for LMS, ATS, interview scorecards, quizzes, training content, and selection workflows.",
  departments: ["hr"],
  systems: ["lms", "ats", "google_calendar", "youtube"],
  capabilities: ["learning", "training", "recruiting", "selection", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["learning", "recruiting", "hr_talent"],
    collections: ["learners", "courses", "enrollments", "certifications", "skills", "candidates", "applications", "interviews", "offers"],
    materializes: "learning, training, candidate, application, interview, and assessment rows into talent simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/\blms\b/, /\bats\b/, /training/, /learning/, /quiz/, /interview/, /scorecard/, /selection/, /candidate/]);
  },
  apply({ schema, generatedTables }) {
    seedTalentTable(schema, generatedTables, "lms_records");
    seedTalentTable(schema, generatedTables, "lms_events");
    seedTalentTable(schema, generatedTables, "ats_records");
    seedTalentTable(schema, generatedTables, "ats_events");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_learning_talent",
      expectedToolKinds: ["query", "evidence_lookup", "calculation"],
      mustReferenceEntities: ["lms_records", "ats_records", "employees"],
      successCriteria: ["Use LMS/ATS status evidence before summarizing readiness or selection outcomes.", "Distinguish training completion from assigned or pending training.", "Escalate missing candidate or learner evidence."],
      refusalRules: ["Do not invent candidate scores, training completion, or interview outcomes without ATS/LMS evidence."],
    });
  },
};
