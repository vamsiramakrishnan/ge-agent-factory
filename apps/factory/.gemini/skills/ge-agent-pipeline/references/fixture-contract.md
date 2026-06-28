# Fixture Contract

Every generated mock-data bundle must include `manifest.json`.

Required manifest shape:

```json
{
  "id": "hr-transformation",
  "generatedAt": "2026-05-11T00:00:00.000Z",
  "domain": "hr",
  "systems": [
    {
      "id": "workday",
      "type": "api",
      "entities": ["employees", "jobs", "skills"]
    }
  ],
  "tables": [
    {
      "name": "employees",
      "path": "tables/employees.csv",
      "primaryKey": "employee_id",
      "columns": [
        {"name": "employee_id", "type": "string"},
        {"name": "department", "type": "string"}
      ]
    }
  ],
  "documents": [
    {
      "id": "policy-2026",
      "path": "documents/policy-2026.md",
      "linkedEntities": ["employees"]
    }
  ],
  "relationships": [
    {
      "from": "employees.manager_id",
      "to": "employees.employee_id"
    }
  ],
  "anomalies": [
    {
      "id": "skills-gap-region-west",
      "description": "West region has a high concentration of employees missing required AI skills.",
      "evidence": ["employees", "skills", "policy-2026"],
      "expectedDiscoveryPath": [
        "query employees by region",
        "join required skills",
        "compare training completion"
      ]
    }
  ]
}
```

Rules:

- Stable IDs: all cross-system entities need deterministic IDs.
- Source-system naming: every table must include `sourceSystem` and `sourceSystemId` matching `mock_systems/usecase-spec.json`.
- Tool naming: generated tools must use real source-system ids, for example `query_workday_employees` and `query_google_chat_messages`.
- Row policy: use `mock_systems/usecase-spec.json.rowPolicy`; generated rows must meet `minimumRowsPerEntity`.
- Referential integrity: every `ref` column must resolve to an existing generated primary key.
- Documents: every document needs substantive business content, linked entities, and source-system evidence metadata.
- Seeded anomalies: every demo scenario needs at least one non-obvious anomaly.
- External evidence must reference real IDs from structured data.
- Generated data must be reproducible from the same scenario file.
- Avoid PII; use synthetic names and emails.
- Query adapters must enforce limits by default.
