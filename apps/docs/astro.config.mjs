import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { SITE_DESCRIPTION, SITE_TITLE } from "./src/lib/site-meta.mjs";

// The docs website. Content is NOT authored here — scripts/sync-content.mjs
// renders the repo's canonical docs/ markdown into src/content/docs before
// every dev/build (see package.json), so docs/ stays the single source of
// truth and this app is presentation only: theme, information architecture,
// and the handful of curated pages (landing, quickstart).
//
// Starlight gives the devex the Jekyll site couldn't: instant client-side
// full-text search (Pagefind), dark mode, copy-to-clipboard on every code
// block, prev/next page links, per-page "Edit this page" pointing at the
// docs/ source, and MDX components on curated pages.
export default defineConfig({
  site: "https://vamsiramakrishnan.github.io",
  base: "/ge-agent-factory",
  integrations: [
    starlight({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/vamsiramakrishnan/ge-agent-factory" },
      ],
      // Default for curated pages; synced pages carry a per-page `editUrl`
      // pointing back at their docs/ source file instead.
      editLink: { baseUrl: "https://github.com/vamsiramakrishnan/ge-agent-factory/edit/main/apps/docs/" },
      expressiveCode: {
        // Match the product's light-first palette; accessible-pygments
        // github-light is what the Jekyll site used.
        themes: ["github-dark", "github-light"],
        styleOverrides: { borderRadius: "0.5rem" },
      },
      sidebar: [
        { label: "Start Here", autogenerate: { directory: "start" } },
        { label: "Core Concepts", autogenerate: { directory: "concepts" } },
        { label: "Guides", autogenerate: { directory: "cookbooks" } },
        { label: "Console", autogenerate: { directory: "console" } },
        { label: "Operations", autogenerate: { directory: "operations" } },
        { label: "Reference", autogenerate: { directory: "reference" } },
        { label: "Contributor Docs", autogenerate: { directory: "contributing" } },
      ],
    }),
  ],
});
