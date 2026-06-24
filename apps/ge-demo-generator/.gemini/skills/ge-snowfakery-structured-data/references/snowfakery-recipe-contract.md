# Snowfakery Recipe Contract

Use this reference only when writing or auditing `mock_data/snowfakery/structured.recipe.yml`.

Snowfakery is the YAML control plane for structured data. It can generate OLTP rows, OLAP facts/dimensions, and source snapshots before datastore-specific packaging.

Recipe requirements:

- Deterministic seed and repeatable row counts.
- Domain-specific table/object names.
- Stable IDs that downstream tools can cite.
- Relationships represented explicitly.
- At least one seeded edge case tied to the KPI.
- Audit/source fields where source-system evidence is expected.
- No generic placeholder columns unless justified by the source.

Recommended sections:

```yaml
- object: Employee
- object: BenefitPlan
- object: EnrollmentEvent
- object: AuditTrail
- object: MetricSnapshot
```

Keep cloud loading out of the recipe. Hand off generated rows to OLTP, OLAP, or blob packagers.
