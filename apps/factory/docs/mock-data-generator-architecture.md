# Mock Data Generator Architecture

## Position

Snowfakery should be a first-class generator backend for **structured row data**, including both OLTP and OLAP-shaped data. The right boundary is:

- Snowfakery: YAML recipe language for generating structured rows, relationships, distributions, and deterministic scenarios.
- GE packagers: decide where those rows go and generate deployment artifacts for AlloyDB, Firestore, Bigtable, BigQuery, and Cloud Storage.
- Document/blob generators: create PDF/DOCX/Markdown/HTML/email/chat artifacts and metadata manifests.

Faker still matters, but as a primitive provider underneath recipes. It should not be the main authoring interface when users and agents need inspectable generation configuration.

## Data Classes

### OLTP SQL

Use for transactional source-system records:

- HRIS, ERP, CRM, CLM, ITSM, procurement, payroll, benefits, finance operations.
- Needs joins, primary keys, foreign keys, constraints, status transitions, audit records.
- Preferred Google Cloud target: **AlloyDB for PostgreSQL**.
- Fallback: Cloud SQL PostgreSQL.
- Generation config: **Snowfakery YAML**.

### OLTP NoSQL

Use for document/event operational stores:

- Chat messages, notifications, task events, approvals, user preferences, session state.
- Preferred target: **Firestore** for document-style operational records.
- Use **Bigtable** for very high-volume time-series/event streams.
- Generation config: Snowfakery for structured rows plus JSON/event templates where needed.

### OLAP

Use for analytics:

- Facts, metric snapshots, scoring outputs, feed snapshots, funnel data, spend cubes, risk scores, time series.
- Preferred target: **BigQuery**.
- Snowfakery can generate OLAP rows. GE then packages output as BigQuery schemas and NDJSON/CSV load files.

### Unstructured Blobs

Use for source evidence:

- PDF, DOCX, Google Docs exports, contracts, policies, SPDs, emails, transcripts, images, spreadsheets.
- Preferred target: **Cloud Storage**.
- Metadata target: BigQuery `documents_manifest`, optionally Vertex AI Search / Document AI later.
- Generation config: composable blob skills and templates, plus manifest YAML/JSON.

## Architecture

```text
src/components/slides/use-cases
  -> source map extractor
  -> data-class planner
  -> package plan
       OLTP SQL -> Snowfakery recipe -> AlloyDB/Cloud SQL load plan
       OLTP NoSQL -> Snowfakery/event recipe -> Firestore/Bigtable load plan
       OLAP -> Snowfakery recipe -> BigQuery schema + NDJSON
       Blobs -> docx/pdf/markdown generators -> Cloud Storage + documents_manifest
  -> ADK tools/evals
  -> validation gates
```

## CLI Surface

The CLI should expose mechanisms, not one monolithic command:

```bash
factory sources --slides ../../src/components/slides/use-cases
node scripts/plan-mock-data.mjs --dir <workspace> --usecase BenefitsAssistant
factory snowfakery-recipe --dir <workspace>
factory data-plan --dir <workspace> --project <project> --location US
factory tools --dir <workspace>
factory test --dir <workspace>
```

Next target commands:

```bash
factory plan-data --dir <workspace> --usecase BenefitsAssistant
factory package-oltp --dir <workspace> --target alloydb
factory package-oltp --dir <workspace> --target firestore
factory package-olap --dir <workspace> --target bigquery
factory package-blobs --dir <workspace> --target gcs --formats pdf,docx,md
```

## Skill Composition

Use canonical repository skills with progressive disclosure:

- `interviewing-specs`: turns slide/user intent into a concrete use-case spec.
- `planning-missions`: decides local/remote ownership and mission graph shape.
- `running-factory`: runs factory stages and parses factory artifacts.
- `building-simulators`: owns source-system modeling, Snowfakery recipes, simulator seed materialization, and data packaging guidance.
- `checking-workspaces`: validates generated workspaces and gates.
- `running-release`: owns cloud data loading, deployment, registration, publishing, and live verification.
- `recording-evidence`: records artifacts, blockers, repairs, and upstream learning.

Detailed source mapping, Snowfakery, OLTP/OLAP/blob packaging, API/MCP adapters, and simulator archetypes live behind `building-simulators` references and scripts. Do not reintroduce separate legacy `ge-*` skill names for those subdomains.

## Benefits Example

`BenefitsAssistant.tsx` maps to:

- Workday: OLTP SQL, AlloyDB-shaped operational employee/life-event records.
- Benefitfocus / Benefits Platform: OLTP SQL, AlloyDB-shaped plan, eligibility, enrollment, carrier sync records.
- Google Chat: OLTP NoSQL/event, Firestore or Bigtable-shaped message/notification records.
- Google Drive: unstructured blobs, Cloud Storage plan docs/SPDs plus `documents_manifest`.
- BigQuery: optional OLAP reporting tables for utilization, ticket reduction, enrollment accuracy.
- Vertex AI/Gemini: runtime, not generated source data.

## Non-Goals

- Do not run cloud mutations unless explicitly requested.
- Do not generate live PII.
- Do not confuse the row generator with the deployment packager.
- Do not settle for generic `name/value/status` rows when slide source systems describe concrete records.
