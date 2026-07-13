#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(APP, "public", "og.svg");
const target = join(APP, "public", "og.png");
const digestFile = join(APP, "scripts", "og.source.sha256");
const sourceBytes = await readFile(source);
const sourceDigest = createHash("sha256").update(sourceBytes).digest("hex");

if (process.argv.includes("--check")) {
  const [recordedDigest, metadata] = await Promise.all([
    readFile(digestFile, "utf8").catch(() => ""),
    sharp(target).metadata().catch(() => null),
  ]);
  if (recordedDigest.trim() !== sourceDigest || metadata?.width !== 1200 || metadata?.height !== 630) {
    console.error("Social card drift: run `bun run --filter ./apps/docs social-card` and commit public/og.png.");
    process.exitCode = 1;
  } else {
    console.log("Social card check passed: public/og.png was rendered from the current 1200×630 SVG source.");
  }
} else {
  const rendered = await sharp(sourceBytes).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(target, rendered);
  await writeFile(digestFile, `${sourceDigest}\n`);
  console.log("Generated apps/docs/public/og.png from og.svg.");
}
