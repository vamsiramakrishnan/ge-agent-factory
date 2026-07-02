// GET /llms.txt — the https://llmstxt.org/ index of this docs site: title,
// one-line description, then every published page (the same synced content
// collection Starlight renders) with an absolute URL and a description, in
// deterministic sidebar-then-slug order. Static endpoint: built into
// dist/llms.txt by `astro build`.
import { getCollection } from "astro:content";
import {
  buildLlmsTxt,
  firstProseSentence,
  orderPages,
  plainifyMdx,
  siteRootFrom,
} from "../lib/llms.mjs";
import { SITE_DESCRIPTION, SITE_TITLE } from "../lib/site-meta.mjs";

export async function GET() {
  const entries = await getCollection("docs");
  const siteRoot = siteRootFrom(import.meta.env.SITE, import.meta.env.BASE_URL);
  const pages = orderPages(entries).map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description || firstProseSentence(plainifyMdx(entry.body)),
  }));
  return new Response(buildLlmsTxt({ title: SITE_TITLE, description: SITE_DESCRIPTION, siteRoot, pages }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
