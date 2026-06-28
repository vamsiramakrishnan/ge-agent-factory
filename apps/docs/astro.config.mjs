import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Modern docs site (replaces Jekyll/just-the-docs). Built-in Pagefind full-text
// search, dark mode, MDX, and a sidebar auto-generated from the content tree —
// no SaaS search signup, no hand-maintained nav.
export default defineConfig({
  site: "https://vamsiramakrishnan.github.io",
  base: "/ge-agent-factory",
  integrations: [
    starlight({
      title: "GE Agent Factory",
      description: "Turn a business use case into a tested, deployable Gemini Enterprise agent.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/vamsiramakrishnan/ge-agent-factory" }],
      editLink: { baseUrl: "https://github.com/vamsiramakrishnan/ge-agent-factory/edit/main/apps/docs/" },
      sidebar: [
        { label: "Start here", autogenerate: { directory: "start" } },
        { label: "Reference", autogenerate: { directory: "reference" } },
      ],
    }),
  ],
});
