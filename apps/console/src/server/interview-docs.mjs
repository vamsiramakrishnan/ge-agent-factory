/**
 * Interview document store + spec writer.
 *
 * Backs the /api/interviews/:usecaseId/* routes. Documents are stored locally
 * under .ge/interviews/<usecaseId>/uploads/ (always), and ALSO mirrored to GCS
 * when GE_INTERVIEW_BUCKET (or GE_FACTORY_BUCKET) is set and @google-cloud/storage
 * is installed — matching the factory-bridge prod path. The extracted text is
 * cached alongside so the interview can ground itself without re-parsing.
 */
import { join, basename } from "node:path";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { extractDocument } from "./document-preview.mjs";

// apps/console/src/server/ -> repo root is four levels up (mirrors transport.mjs).
const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

/** Max accepted upload size (decoded). BRDs are documents, not datasets. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export function sanitizeId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80) || "new-agent";
}

function sanitizeFilename(value) {
  const base = basename(String(value || "document"));
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "document";
}

export function interviewRoot(usecaseId) {
  return join(REPO_ROOT, ".ge", "interviews", sanitizeId(usecaseId));
}

function uploadsDir(usecaseId) {
  return join(interviewRoot(usecaseId), "uploads");
}

function indexPath(usecaseId) {
  return join(uploadsDir(usecaseId), "documents.json");
}

function gcsBucketName() {
  return (
    process.env.GE_INTERVIEW_BUCKET ||
    process.env.GE_FACTORY_BUCKET ||
    process.env.GE_BUCKET ||
    null
  );
}

async function maybeUploadToGcs(usecaseId, filename, buffer, contentType) {
  const bucket = gcsBucketName();
  if (!bucket) return null;
  try {
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage();
    const objectPath = `interviews/${sanitizeId(usecaseId)}/uploads/${filename}`;
    await storage.bucket(bucket).file(objectPath).save(buffer, {
      resumable: false,
      contentType: contentType || "application/octet-stream",
      metadata: { metadata: { usecaseId: sanitizeId(usecaseId) } },
    });
    return `gs://${bucket}/${objectPath}`;
  } catch (error) {
    // GCS is best-effort: local copy is the source of truth in dev.
    console.warn(`[interview-docs] GCS mirror skipped: ${error?.message || error}`);
    return null;
  }
}

async function readIndex(usecaseId) {
  try {
    const raw = await readFile(indexPath(usecaseId), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.documents) ? parsed.documents : [];
  } catch {
    return [];
  }
}

async function writeIndex(usecaseId, documents) {
  await mkdir(uploadsDir(usecaseId), { recursive: true });
  await writeFile(indexPath(usecaseId), JSON.stringify({ documents }, null, 2), "utf8");
}

/**
 * Decode, validate, store, parse, and index one uploaded document.
 * @param {string} usecaseId
 * @param {{ filename: string, mimeType?: string, contentBase64: string }} payload
 */
export async function uploadInterviewDocument(usecaseId, payload) {
  const filename = sanitizeFilename(payload?.filename);
  const contentBase64 = String(payload?.contentBase64 || "");
  if (!contentBase64) {
    const err = new Error("contentBase64 is required");
    err.statusCode = 400;
    throw err;
  }
  const buffer = Buffer.from(contentBase64, "base64");
  if (buffer.length === 0) {
    const err = new Error("uploaded document is empty");
    err.statusCode = 400;
    throw err;
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    const err = new Error(`document exceeds ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB limit`);
    err.statusCode = 413;
    throw err;
  }

  const dir = uploadsDir(usecaseId);
  await mkdir(dir, { recursive: true });
  const localPath = join(dir, filename);
  await writeFile(localPath, buffer);

  const gcsUri = await maybeUploadToGcs(usecaseId, filename, buffer, payload?.mimeType);

  let extracted;
  try {
    extracted = await extractDocument({ name: filename, buffer });
  } catch (error) {
    // Unsupported/parse failure: keep the stored file, surface the reason.
    extracted = {
      kind: "unknown",
      title: filename,
      text: "",
      sections: [],
      truncated: false,
      charCount: 0,
      note: error?.message || "extraction failed",
    };
  }

  // Cache the extracted text next to the upload.
  await writeFile(join(dir, `${filename}.extracted.txt`), extracted.text, "utf8");

  const record = {
    filename,
    uri: gcsUri || localPath,
    storage: gcsUri ? "gcs" : "local",
    bytes: buffer.length,
    mimeType: payload?.mimeType || null,
    kind: extracted.kind,
    charCount: extracted.charCount,
    truncated: extracted.truncated,
    note: extracted.note || null,
    uploadedAt: new Date().toISOString(),
  };

  const documents = (await readIndex(usecaseId)).filter((d) => d.filename !== filename);
  documents.push(record);
  await writeIndex(usecaseId, documents);

  return { ...record, text: extracted.text, sections: extracted.sections };
}

/** List stored documents for a use case, including cached extracted text. */
export async function listInterviewDocuments(usecaseId) {
  const documents = await readIndex(usecaseId);
  const dir = uploadsDir(usecaseId);
  const withText = await Promise.all(
    documents.map(async (doc) => {
      let text = "";
      try {
        text = await readFile(join(dir, `${doc.filename}.extracted.txt`), "utf8");
      } catch {
        text = "";
      }
      return { ...doc, text };
    }),
  );
  return { documents: withText };
}

/** Concatenate the chosen documents' extracted text into a single grounding blob. */
export async function groundingTextFor(usecaseId, filenames = null) {
  const { documents } = await listInterviewDocuments(usecaseId);
  const chosen = Array.isArray(filenames) && filenames.length
    ? documents.filter((d) => filenames.includes(d.filename))
    : documents;
  return chosen
    .filter((d) => d.text && d.text.trim())
    .map((d) => `# ${d.filename}\n${d.text.trim()}`)
    .join("\n\n---\n\n");
}

/** Persist a (possibly user-edited) agent-spec back to disk for registration. */
export async function writeInterviewSpec(usecaseId, spec) {
  if (!spec || typeof spec !== "object") {
    const err = new Error("spec must be a JSON object");
    err.statusCode = 400;
    throw err;
  }
  const dir = interviewRoot(usecaseId);
  await mkdir(dir, { recursive: true });
  const specPath = join(dir, "agent-spec.json");
  await writeFile(specPath, JSON.stringify(spec, null, 2), "utf8");
  // Return a repo-relative path so it matches what registerSpec expects.
  const relPath = `.ge/interviews/${sanitizeId(usecaseId)}/agent-spec.json`;
  return { path: relPath, absolutePath: specPath };
}

/**
 * Read the interview's agent-spec.json and return its embedded `generationSpec`,
 * normalized to the shape the presentation's FactoryProvisionPanel validates
 * (entities/sourceSystems/documents/apis/anomalies arrays + rowPolicy/validation
 * objects). Returns null when no spec / generationSpec is on disk. This is what the
 * presentation deploy panel fetches via ?spec=<console-url>.
 */
export async function readGenerationSpec(usecaseId) {
  let agentSpec;
  try {
    agentSpec = JSON.parse(await readFile(join(interviewRoot(usecaseId), "agent-spec.json"), "utf8"));
  } catch {
    return null;
  }
  const gen = agentSpec?.generationSpec;
  if (!gen || typeof gen !== "object") return null;
  // Normalize: the presentation requires these to be present (catalog specs omit `apis`).
  return {
    ...gen,
    entities: Array.isArray(gen.entities) ? gen.entities : [],
    sourceSystems: Array.isArray(gen.sourceSystems) ? gen.sourceSystems : [],
    documents: Array.isArray(gen.documents) ? gen.documents : [],
    apis: Array.isArray(gen.apis) ? gen.apis : [],
    anomalies: Array.isArray(gen.anomalies) ? gen.anomalies : [],
    rowPolicy: gen.rowPolicy && typeof gen.rowPolicy === "object" ? gen.rowPolicy : {},
    validation: gen.validation && typeof gen.validation === "object" ? gen.validation : {},
  };
}

export async function listUploadFiles(usecaseId) {
  try {
    return await readdir(uploadsDir(usecaseId));
  } catch {
    return [];
  }
}

/**
 * Convert the interview's agent-spec.json into an OKF v0.1 Knowledge Bundle and
 * return it as a flat map of `path -> markdown` (the same concept set
 * scripts/spec-to-okf.mjs writes to disk). This makes OKF the portable handoff
 * for an interview: the questions the agent answers, how each is tested, and its
 * source documents — all as typed concepts. Returns null when no spec is on disk.
 *
 * Implemented by importing the generator's pure `buildBundle`/`renderConcept`
 * (no spawn, no FS writes) — additive and consistent with the in-process
 * generation-spec route beside it.
 */
export async function interviewOkfBundle(usecaseId) {
  let agentSpec;
  try {
    agentSpec = JSON.parse(await readFile(join(interviewRoot(usecaseId), "agent-spec.json"), "utf8"));
  } catch {
    return null;
  }
  if (!agentSpec || !agentSpec.generationSpec) return null;
  // Workspace specs may nest the catalog object under `spec`; mirror loadSpec.
  const spec = agentSpec.generationSpec ? agentSpec : agentSpec.spec || agentSpec;
  if (!spec.id) spec.id = sanitizeId(usecaseId);
  const { buildBundle } = await import(
    join(REPO_ROOT, "apps", "factory", "scripts", "spec-to-okf.mjs")
  );
  const { renderConcept } = await import(
    join(REPO_ROOT, "apps", "factory", "scripts", "lib", "okf.mjs")
  );
  const concepts = buildBundle(spec);
  const files = {};
  for (const concept of concepts) {
    files[`${concept.relPath}.md`] = renderConcept(concept.fields, concept.body);
  }
  return { id: spec.id, conceptCount: concepts.length, files };
}
