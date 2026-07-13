// One information architecture for both Starlight navigation and the plain
// LLM exports. A section added here cannot silently drift into a different
// order or label in /llms.txt.
export const SITE_SECTIONS = Object.freeze([
  { key: "start", label: "Start Here", sidebar: { label: "Start Here", collapsed: true, autogenerate: { directory: "start" } } },
  { key: "catalog", label: "Agent catalog", sidebar: { label: "Agent catalog", link: "/catalog/" } },
  { key: "concepts", label: "Core Concepts", sidebar: { label: "Core Concepts", collapsed: true, autogenerate: { directory: "concepts" } } },
  { key: "cookbooks", label: "Guides", sidebar: { label: "Guides", collapsed: true, autogenerate: { directory: "cookbooks" } } },
  { key: "console", label: "Console", sidebar: { label: "Console", collapsed: true, autogenerate: { directory: "console" } } },
  { key: "operations", label: "Operations", sidebar: { label: "Operations", collapsed: true, autogenerate: { directory: "operations" } } },
  { key: "reference", label: "Reference", sidebar: { label: "Reference", collapsed: true, autogenerate: { directory: "reference" } } },
  { key: "contributing", label: "Contributor Docs", sidebar: { label: "Contributor Docs", collapsed: true, autogenerate: { directory: "contributing" } } },
]);

export const STARLIGHT_SIDEBAR = SITE_SECTIONS.map(({ sidebar }) => sidebar);
