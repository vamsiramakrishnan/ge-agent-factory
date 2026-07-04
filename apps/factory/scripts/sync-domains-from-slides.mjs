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
const VERTICAL_SEEDS_ROOT = join(import.meta.dirname, "..", "catalog", "vertical-seeds");
const OUTPUT = join(import.meta.dirname, "..", "src", "domains.generated.js");

const DEPARTMENTS = ["hr", "finance", "it", "marketing", "procurement"];

// Vertical industries contribute value streams as domains; their catalog
// source is the tracked seed files, not presentation slides.
const VERTICAL_COLORS = {
  retail: "#f59e0b",
  banking: "#10b981",
  insurance: "#6366f1",
  telco: "#06b6d4",
  manufacturing: "#ef4444",
};

async function extractVerticalDomains() {
  let files;
  try {
    files = (await readdir(VERTICAL_SEEDS_ROOT)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const domains = [];
  for (const file of files) {
    const seed = JSON.parse(await readFile(join(VERTICAL_SEEDS_ROOT, file), "utf8"));
    for (const stream of seed.valueStreams || []) {
      const slug = stream.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      domains.push({
        id: `${seed.department}-${slug}`,
        slug,
        department: seed.department,
        title: stream.name,
        subtitle: `${stream.code} • ${seed.industry[0].toUpperCase()}${seed.industry.slice(1)} Value Stream`,
        description: `${stream.name} value stream for the ${seed.industry} vertical — ${stream.useCases.length} agentified workflows.`,
        color: VERTICAL_COLORS[seed.department] || "#666",
        domainNumber: Number(String(stream.code).replace(/^[A-Z]+-/, "")) || 0,
        useCases: (stream.useCases || []).map((uc) => ({
          id: uc.id,
          title: uc.title,
          description: (uc.agentification || [])[0] || "",
        })),
        useCaseCount: (stream.useCases || []).length,
        sourceFile: `catalog/vertical-seeds/${file}`,
      });
    }
  }
  return domains;
}

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

  const verticalDomains = await extractVerticalDomains();
  for (const dept of [...new Set(verticalDomains.map((d) => d.department))]) {
    const domains = verticalDomains.filter((d) => d.department === dept);
    allDomains.push(...domains);
    summary[dept] = { domains: domains.length, useCases: domains.reduce((s, d) => s + d.useCaseCount, 0) };
  }

  const totalUseCases = allDomains.reduce((s, d) => s + d.useCaseCount, 0);
  const departmentCount = Object.keys(summary).length;

  const output = `// Auto-generated from slide domain catalogs and vertical value-stream seeds. Do not edit manually.
// Run: node scripts/sync-domains-from-slides.mjs
// ${allDomains.length} domains, ${totalUseCases} use cases across ${departmentCount} departments.

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
