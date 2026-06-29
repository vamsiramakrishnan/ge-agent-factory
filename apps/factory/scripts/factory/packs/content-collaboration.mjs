import { appendPackEvalHint, ensureRow, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const REVIEW_STATES = ["draft", "review", "published", "archived"];
const REVISION_ACTIONS = ["create", "update", "approve", "share"];

function titleFor(schema, index) {
  const title = schema?.useCaseSpec?.title || "Operational";
  return `${title} ${["Policy Brief", "Review Notes", "Approval Packet", "Publishing Checklist"][index % 4]}`;
}

function seedDocuments(schema, generatedTables) {
  const tableDef = findTableDef(schema, "documents");
  const rows = tableRows(generatedTables, "documents");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "title", titleFor(schema, index));
    setIfColumn(row, tableDef.columns, "owner", ["Maya Chen", "Jordan Lee", "Priya Shah", "Alex Morgan"][index]);
    setIfColumn(row, tableDef.columns, "status", REVIEW_STATES[index % REVIEW_STATES.length]);
    setIfColumn(row, tableDef.columns, "last_updated", `2026-05-${String(20 + index).padStart(2, "0")}`);
  });
}

function seedComments(schema, generatedTables) {
  const tableDef = findTableDef(schema, "comments");
  const rows = tableRows(generatedTables, "comments");
  const documents = tableRows(generatedTables, "documents");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", index === 0 ? "pending" : index === 1 ? "active" : "closed");
    setIfColumn(row, tableDef.columns, "owner", ["Maya Chen", "Jordan Lee", "Priya Shah", "Alex Morgan"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(21 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${titleFor(schema, index)} requires evidence-backed revision before publication.`);
    setIfColumn(row, tableDef.columns, "document_id", documents[index % Math.max(documents.length, 1)]?.id);
  });
}

function seedRevisionHistory(schema, generatedTables) {
  const tableDef = findTableDef(schema, "revision_history");
  const rows = tableRows(generatedTables, "revision_history");
  const documents = tableRows(generatedTables, "documents");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "actor", ["Maya Chen", "Jordan Lee", "Priya Shah", "Alex Morgan"][index]);
    setIfColumn(row, tableDef.columns, "action", REVISION_ACTIONS[index % REVISION_ACTIONS.length]);
    setIfColumn(row, tableDef.columns, "target_type", "document");
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(18 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `Revision ${index + 1} captures approval evidence and publish-readiness changes.`);
    setIfColumn(row, tableDef.columns, "document_id", documents[index % Math.max(documents.length, 1)]?.id);
  });
}

export const contentCollaborationPack = {
  id: "system_content_collaboration",
  layer: "system",
  description: "Common document, meeting, and collaboration recipe for Docs, Drive, Slack, content drafting, review, and publishing workflows.",
  systems: ["google_docs", "google_drive", "slack", "google_meet", "wordpress", "contentful"],
  capabilities: ["document_grounding", "content_review", "collaboration", "publishing", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["collaboration_docs", "content_cms"],
    collections: ["workspaces", "documents", "comments", "tasks", "assets", "content_items", "workflow_tasks", "approvals"],
    materializes: "document, comment, revision, content review, and publishing workflow rows into simulator seed overlays",
  },
  match(context) {
    return hasAny(textOf(context), [/google_docs/, /google_drive/, /\bslack\b/, /google_meet/, /document/, /revision_history/, /comments/, /draft/, /publish/, /contentful/, /wordpress/]);
  },
  apply({ schema, generatedTables }) {
    seedDocuments(schema, generatedTables);
    seedComments(schema, generatedTables);
    seedRevisionHistory(schema, generatedTables);
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_content_collaboration",
      expectedToolKinds: ["query", "evidence_lookup"],
      mustReferenceEntities: ["documents", "comments", "revision_history"],
      successCriteria: ["Cite document titles or revision evidence for content claims.", "Distinguish draft, review, published, and archived states.", "Escalate unresolved review comments before publish-like actions."],
      refusalRules: ["Do not claim a document is approved or published without document or revision evidence."],
    });
  },
};
