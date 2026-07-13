// GET /llms-full.txt — the whole documentation set as one plain-markdown
// file for LLM consumption: every published page (same synced collection
// Starlight renders, same deterministic order as /llms.txt), frontmatter
// dropped, MDX imports/components and the glossary linker's tooltip anchors
// stripped back out (src/lib/llms.mjs). Built into dist/llms-full.txt.
import { getCollection } from "astro:content";
import { buildLlmsFullTxt, orderPages, plainifyMdx, siteRootFrom } from "../lib/llms.mjs";
import { SITE_DESCRIPTION, SITE_TITLE } from "../lib/site-meta.mjs";
import catalog from "../data/agent-catalog.json";

export async function GET() {
  const entries = await getCollection("docs");
  const siteRoot = siteRootFrom(import.meta.env.SITE, import.meta.env.BASE_URL);
  const pages = orderPages(entries).map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    plain: plainifyMdx(entry.body, { base: import.meta.env.BASE_URL, siteRoot }),
  }));
  const catalogScope = {
    detailPageCount: Number(catalog.meta.totalAgents) + Number(catalog.meta.totalVerticalAgents),
  };
  return new Response(buildLlmsFullTxt({ title: SITE_TITLE, description: SITE_DESCRIPTION, siteRoot, pages, catalogScope }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
