import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Stage private text artifacts beside their destinations and atomically
 * rename them into place. Related artifacts must be ordered sidecars first,
 * primary artifact last, so the primary is never visible before its evidence.
 */
export async function writePrivateArtifacts(artifacts) {
  if (!Array.isArray(artifacts) || !artifacts.length) throw new Error("private artifact write requires at least one artifact");
  const staged = [];
  try {
    for (const artifact of artifacts) {
      if (!artifact?.path || typeof artifact.text !== "string") {
        throw new Error("private artifacts require path and text");
      }
      await mkdir(dirname(artifact.path), { recursive: true, mode: 0o700 });
      const temporary = `${artifact.path}.${process.pid}.${randomUUID()}.tmp`;
      await writeFile(temporary, artifact.text, { encoding: "utf8", flag: "wx", mode: 0o600 });
      staged.push({ ...artifact, temporary });
    }
    for (const artifact of staged) await rename(artifact.temporary, artifact.path);
  } finally {
    await Promise.all(staged.map((artifact) => rm(artifact.temporary, { force: true })));
  }
}
