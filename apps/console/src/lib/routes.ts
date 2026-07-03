import {
  LayoutDashboard,
  Route as RouteIcon,
  MessageSquareText,
  Boxes,
  Wrench,
  ListChecks,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for navigation. Sidebar, CommandPalette, and the App
// route switch all read from this so labels and destinations can never drift
// (previously the sidebar said "Settings"/"Pipeline" while the palette said
// "Open Readiness"/"Open Home" and pointed at routes with no nav entry).
export interface RouteDef {
  id: string;
  hash: string;
  label: string;
  Icon: LucideIcon;
  nav: boolean; // show in the sidebar
  palette: boolean; // offer as a "Go to …" entry in the command palette
}

// Route ids match their labels' vocabulary (pipeline/repair — the same
// nouns the CLI uses).
export const ROUTES: RouteDef[] = [
  { id: "overview", hash: "#/overview", label: "Overview", Icon: LayoutDashboard, nav: true, palette: true },
  { id: "pipeline", hash: "#/pipeline", label: "Pipeline", Icon: RouteIcon, nav: true, palette: true },
  { id: "interview", hash: "#/interview", label: "Interview", Icon: MessageSquareText, nav: true, palette: true },
  { id: "fleet", hash: "#/fleet", label: "Fleet", Icon: Boxes, nav: true, palette: true },
  { id: "repair", hash: "#/repair", label: "Repair Queue", Icon: Wrench, nav: true, palette: true },
  { id: "activity", hash: "#/activity", label: "Runs", Icon: ListChecks, nav: true, palette: true },
  { id: "doctor", hash: "#/doctor", label: "Readiness", Icon: Stethoscope, nav: true, palette: true },
];

export const NAV_ROUTES = ROUTES.filter((r) => r.nav);
export const PALETTE_ROUTES = ROUTES.filter((r) => r.palette);

// Param/detail routes that have no nav entry map to the nav item they live under,
// so the sidebar still highlights the right section (and breadcrumbs show the trail).
export const ROUTE_PARENT: Record<string, string> = {
  agent: "fleet",
  "spec-review": "pipeline",
};

// Human label for a route id (detail routes without a ROUTES entry get a sensible default).
const DETAIL_LABELS: Record<string, string> = { agent: "Agent", "spec-review": "Spec Review" };
export function labelFor(routeId: string): string {
  return ROUTES.find((r) => r.id === routeId)?.label ?? DETAIL_LABELS[routeId] ?? routeId;
}

export function hashFor(routeId: string): string {
  return ROUTES.find((r) => r.id === routeId)?.hash ?? `#/${routeId}`;
}

export function activeNavId(route: string): string {
  return ROUTE_PARENT[route] ?? route;
}
