#!/usr/bin/env node
/**
 * sync-domains-from-slides.mjs
 *
 * Extracts domain catalog data from the main app's TSX slide components
 * and writes it as structured JSON for the demo-generator to consume.
 *
 * Source: ../presentation/src/components/slides/domains/{dept}/*Catalog.tsx
 * Output: src/domains.generated.js
 *
 * Usage: node scripts/sync-domains-from-slides.mjs
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, basename, resolve } from "node:path";

const SLIDES_ROOT = resolve(import.meta.dirname, "..", "..", "presentation", "src", "components", "slides", "domains");
const OUTPUT = join(import.meta.dirname, "..", "src", "domains.generated.js");

const DEPARTMENTS = ["hr", "finance", "it", "marketing", "procurement"];

function extractProps(tsx) {
  const props = {};
  const titleMatch = tsx.match(/title="([^"]+)"/);
  const subtitleMatch = tsx.match(/subtitle="([^"]+)"/);
  const descMatch = tsx.match(/description="([^"]+)"/);
  const colorMatch = tsx.match(/color="([^"]+)"/);
  if (titleMatch) props.title = titleMatch[1];
  if (subtitleMatch) props.subtitle = subtitleMatch[1];
  if (descMatch) props.description = descMatch[1];
  if (colorMatch) props.color = colorMatch[1];

  const domainMatch = props.subtitle?.match(/Domain (\d+)/);
  if (domainMatch) props.domainNumber = parseInt(domainMatch[1], 10);

  return props;
}

function extractUseCases(tsx) {
  const useCases = [];
  const ucRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g;
  let match;
  while ((match = ucRegex.exec(tsx)) !== null) {
    useCases.push({
      id: match[1],
      title: match[2],
      description: match[3],
    });
  }
  return useCases;
}

async function extractDomain(filePath, department) {
  const tsx = await readFile(filePath, "utf8");
  const props = extractProps(tsx);
  const useCases = extractUseCases(tsx);
  const fileName = basename(filePath, ".tsx");
  const slug = fileName.replace(/Catalog$/, "").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");

  return {
    id: `${department}-${slug}`,
    slug,
    department,
    title: props.title || fileName.replace(/Catalog$/, ""),
    subtitle: props.subtitle || "",
    description: props.description || "",
    color: props.color || "#666",
    domainNumber: props.domainNumber || 0,
    useCases,
    useCaseCount: useCases.length,
    sourceFile: filePath.replace(/.*src\/components/, "src/components"),
  };
}

async function main() {
  const allDomains = [];
  const summary = {};

  for (const dept of DEPARTMENTS) {
    const deptDir = join(SLIDES_ROOT, dept);
    let files;
    try {
      files = (await readdir(deptDir)).filter((f) => f.endsWith("Catalog.tsx")).sort();
    } catch {
      console.error(`Skipping ${dept}: directory not found`);
      continue;
    }

    const domains = [];
    for (const file of files) {
      const domain = await extractDomain(join(deptDir, file), dept);
      domains.push(domain);
    }

    domains.sort((a, b) => a.domainNumber - b.domainNumber);
    allDomains.push(...domains);
    summary[dept] = { domains: domains.length, useCases: domains.reduce((s, d) => s + d.useCaseCount, 0) };
  }

  const totalUseCases = allDomains.reduce((s, d) => s + d.useCaseCount, 0);

  const output = `// Auto-generated from slide domain catalogs. Do not edit manually.
// Run: node scripts/sync-domains-from-slides.mjs
// ${allDomains.length} domains, ${totalUseCases} use cases across ${DEPARTMENTS.length} departments.

export const DOMAIN_CATALOG = ${JSON.stringify(allDomains, null, 2)};

export const DOMAIN_SUMMARY = ${JSON.stringify(summary, null, 2)};

export function getDomainsByDepartment(dept) {
  return DOMAIN_CATALOG.filter((d) => d.department === dept);
}

export function getDomainById(id) {
  return DOMAIN_CATALOG.find((d) => d.id === id) || null;
}

export function searchDomains(query) {
  const q = query.toLowerCase();
  return DOMAIN_CATALOG.filter((d) =>
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.useCases.some((uc) => uc.title.toLowerCase().includes(q) || uc.description.toLowerCase().includes(q))
  );
}
`;

  await writeFile(OUTPUT, output, "utf8");

  console.log(JSON.stringify({
    ok: true,
    output: OUTPUT,
    departments: DEPARTMENTS.length,
    domains: allDomains.length,
    useCases: totalUseCases,
    summary,
  }, null, 2));
}

main().catch((err) => { console.error(err.message); process.exit(1); });
