import { test, expect, afterAll } from "bun:test";
import { rm } from "node:fs/promises";
import { extractDocument, kindForName } from "./document-preview.mjs";
import {
  uploadInterviewDocument,
  listInterviewDocuments,
  writeInterviewSpec,
  readGenerationSpec,
  groundingTextFor,
  interviewRoot,
  sanitizeId,
} from "./interview-docs.mjs";
import { handleGeFetchRequest } from "./ge-api-router.mjs";

const TEST_ID = "ztest-interview-docs";
const TEST_ID_NOGEN = "ztest-interview-docs-nogen";

afterAll(async () => {
  await rm(interviewRoot(TEST_ID), { recursive: true, force: true }).catch(() => {});
  await rm(interviewRoot(TEST_ID_NOGEN), { recursive: true, force: true }).catch(() => {});
});

const GEN_SPEC = {
  title: "Benefits Agent",
  generationSpec: {
    version: 1,
    entities: [{ name: "enrollment" }],
    sourceSystems: [{ id: "workday" }],
    documents: [{ id: "plan-doc" }],
    anomalies: [{ id: "a1" }],
    rowPolicy: { mode: "scaled" },
    validation: { smoke: "list enrollments" },
    // note: no `apis` — the presentation requires it, so readGenerationSpec must add it
  },
};

function b64(s) {
  return Buffer.from(s, "utf8").toString("base64");
}

test("kindForName maps extensions", () => {
  expect(kindForName("brd.md")).toBe("text");
  expect(kindForName("spec.pdf")).toBe("pdf");
  expect(kindForName("deck.pptx")).toBe("presentation");
  expect(kindForName("data.bin")).toBe("unknown");
});

test("extractDocument reads plain text/markdown", async () => {
  const result = await extractDocument({ name: "brd.md", buffer: Buffer.from("# Title\nSome requirement.") });
  expect(result.kind).toBe("text");
  expect(result.text).toContain("Some requirement.");
  expect(result.truncated).toBe(false);
});

test("extractDocument parses a .docx via jszip (office path now wired)", async () => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  zip.file(
    "word/document.xml",
    '<?xml version="1.0"?><w:document xmlns:w="x"><w:body>' +
      "<w:p><w:r><w:t>Resolve benefits enrollment exceptions.</w:t></w:r></w:p>" +
      "<w:p><w:r><w:t>Before payroll cutover.</w:t></w:r></w:p>" +
      "</w:body></w:document>",
  );
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const result = await extractDocument({ name: "brd.docx", buffer });
  expect(result.kind).toBe("document");
  expect(result.text).toContain("benefits enrollment exceptions");
  expect(result.text).toContain("payroll cutover");
  expect(result.note).toBeUndefined();
});

test("extractDocument throws 415 for unsupported types", async () => {
  let status = 0;
  try {
    await extractDocument({ name: "x.bin", buffer: Buffer.from([0, 1, 2]) });
  } catch (e) {
    status = e.statusCode;
  }
  expect(status).toBe(415);
});

test("upload -> list -> grounding -> spec round-trip", async () => {
  const up = await uploadInterviewDocument(TEST_ID, {
    filename: "requirements.md",
    mimeType: "text/markdown",
    contentBase64: b64("# Requirements\nResolve benefits enrollment exceptions."),
  });
  expect(up.filename).toBe("requirements.md");
  expect(up.storage).toBe("local");
  expect(up.text).toContain("benefits enrollment");

  const list = await listInterviewDocuments(TEST_ID);
  expect(list.documents).toHaveLength(1);
  expect(list.documents[0].text).toContain("benefits enrollment");

  const grounding = await groundingTextFor(TEST_ID);
  expect(grounding).toContain("requirements.md");
  expect(grounding).toContain("benefits enrollment");

  const wrote = await writeInterviewSpec(TEST_ID, { title: "Benefits Agent", sourceSystems: [{ id: "workday" }] });
  expect(wrote.path).toBe(`.ge/interviews/${sanitizeId(TEST_ID)}/agent-spec.json`);
});

test("upload rejects empty content", async () => {
  let status = 0;
  try {
    await uploadInterviewDocument(TEST_ID, { filename: "empty.txt", contentBase64: "" });
  } catch (e) {
    status = e.statusCode;
  }
  expect(status).toBe(400);
});

test("fetch handler routes GET documents list", async () => {
  const res = await handleGeFetchRequest(
    new Request(`http://localhost/api/interviews/${TEST_ID}/documents`, { method: "GET" }),
  );
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.documents)).toBe(true);
});

test("readGenerationSpec extracts + normalizes the embedded generationSpec", async () => {
  await writeInterviewSpec(TEST_ID, GEN_SPEC);
  const gs = await readGenerationSpec(TEST_ID);
  expect(gs).not.toBeNull();
  expect(gs.sourceSystems[0].id).toBe("workday");
  expect(Array.isArray(gs.apis)).toBe(true); // normalized in even though source omitted it
  expect(gs.apis).toHaveLength(0);
  expect(typeof gs.rowPolicy).toBe("object");
});

test("readGenerationSpec returns null when the spec has no generationSpec", async () => {
  await writeInterviewSpec(TEST_ID_NOGEN, { title: "no gen spec here" });
  expect(await readGenerationSpec(TEST_ID_NOGEN)).toBeNull();
});

test("fetch handler serves generation-spec with permissive CORS", async () => {
  await writeInterviewSpec(TEST_ID, GEN_SPEC);
  const res = await handleGeFetchRequest(
    new Request(`http://localhost/api/interviews/${TEST_ID}/generation-spec`, { method: "GET" }),
  );
  expect(res.status).toBe(200);
  expect(res.headers.get("access-control-allow-origin")).toBe("*");
  const body = await res.json();
  expect(Array.isArray(body.apis)).toBe(true);
  expect(body.sourceSystems[0].id).toBe("workday");
});

test("fetch handler honors readonly gate on upload", async () => {
  const prev = process.env.GE_CONSOLE_READONLY;
  process.env.GE_CONSOLE_READONLY = "1";
  try {
    const res = await handleGeFetchRequest(
      new Request(`http://localhost/api/interviews/${TEST_ID}/documents`, {
        method: "POST",
        body: JSON.stringify({ filename: "x.md", contentBase64: b64("hi") }),
      }),
    );
    expect(res.status).toBe(403);
  } finally {
    if (prev === undefined) delete process.env.GE_CONSOLE_READONLY;
    else process.env.GE_CONSOLE_READONLY = prev;
  }
});
