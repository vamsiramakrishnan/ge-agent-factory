import { ROUTE_PARENT, labelFor, hashFor } from "../../lib/routes";

// Breadcrumb trail for detail/param routes (agent, spec-review), so the user always sees
// where they are (Fleet › Agent: <id>) and can step back to the parent section — instead of
// the old ad-hoc, hardcoded "Back to Fleet" links. Renders nothing on top-level routes.
export function Breadcrumbs({ route, params }: { route: string; params: Record<string, string> }) {
  const parent = ROUTE_PARENT[route];
  if (!parent) return null;
  const id = params.id || params.usecaseId || "";
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 border-b border-outline-variant/30 bg-surface px-6 py-2 text-xs">
      <a href={hashFor(parent)} className="text-secondary transition-colors hover:text-primary">{labelFor(parent)}</a>
      <span className="text-secondary/50" aria-hidden="true">›</span>
      <span className="truncate font-medium text-on-surface">{labelFor(route)}{id ? `: ${id}` : ""}</span>
    </nav>
  );
}
