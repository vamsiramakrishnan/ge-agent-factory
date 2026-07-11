import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { MotionConfig, motion } from "motion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import { Sidebar } from "./components/shell/Sidebar";
import { TopBar } from "./components/shell/TopBar";
import { PositionBand } from "./components/shell/PositionBand";
import { CommandPalette } from "./components/shell/CommandPalette";
import { Breadcrumbs } from "./components/shell/Breadcrumbs";
import { JobToast } from "./components/JobToast";
import { RunDrawer } from "./components/RunDrawer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./lib/toast";
import { RunFollowProvider } from "./state/runFollow";
import { ge, type StatusBoard } from "./services/geClient";
import { AuthGate } from "./auth/AuthGate";

const Overview = lazy(() => import("./views/Overview"));
const Fleet = lazy(() => import("./views/Fleet"));
const Doctor = lazy(() => import("./views/Doctor"));
const Activity = lazy(() => import("./views/Activity"));
const AgentDetail = lazy(() => import("./views/AgentDetail"));
const RepairQueue = lazy(() => import("./views/RepairQueue"));
const Interview = lazy(() => import("./views/Interview"));
const Pipeline = lazy(() => import("./views/Pipeline"));
const SpecReview = lazy(() => import("./views/SpecReview"));

function ViewFallback() {
  return (
    <div className="h-full flex items-center justify-center text-secondary text-sm">
      Loading…
    </div>
  );
}

type Route = "overview" | "pipeline" | "interview" | "spec-review" | "fleet" | "repair" | "doctor" | "activity" | "agent";

interface ParsedRoute {
  route: Route;
  params: Record<string, string>;
}

function parseHash(hash: string): ParsedRoute {
  // Strip "#/" and any "?query" — filters live in the query (see useUrlState) and
  // must not affect route matching.
  const path = hash.slice(2).split("?")[0] || "pipeline";
  if (path.startsWith("agent/")) {
    const id = path.slice(6);
    return { route: "agent", params: { id } };
  }
  if (path.startsWith("spec-review/")) {
    const usecaseId = decodeURIComponent(path.slice("spec-review/".length));
    return { route: "spec-review", params: { usecaseId } };
  }
  return { route: path as Route, params: {} };
}

export default function App() {
  const [status, setStatus] = useState<StatusBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<ParsedRoute>(parseHash(location.hash));

  const refresh = useCallback(async () => {
    try {
      const s = await ge.status();
      setStatus(s);
      setError(null);
    } catch (err: any) {
      setError(err.message || "API unavailable");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      setCurrentRoute(parseHash(location.hash));
      setNavigationOpen(false);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleModeChange = async (mode: "local" | "remote") => {
    try {
      await ge.setMode(mode);
      await refresh();
    } catch (err: any) {
      setError(err.message || "Failed to set mode");
    }
  };

  const renderView = () => {
    const { route, params } = currentRoute;
    const viewProps = { status, refresh };

    switch (route) {
      case "overview": return <Overview {...viewProps} />;
      case "pipeline": return <Pipeline {...viewProps} />;
      case "interview": return <Interview status={status} />;
      case "spec-review": return <SpecReview usecaseId={params.usecaseId} />;
      case "fleet": return <Fleet {...viewProps} />;
      case "repair": return <RepairQueue {...viewProps} />;
      case "doctor": return <Doctor {...viewProps} />;
      case "activity": return <Activity />;
      case "agent": return <AgentDetail id={params.id} {...viewProps} />;
      default: return <Overview {...viewProps} />;
    }
  };

  return (
    <AuthGate>
    <QueryClientProvider client={queryClient}>
    <ToastProvider>
    <RunFollowProvider>
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        status={status}
        mode={status?.mode || "local"}
        onModeChange={handleModeChange}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenNavigation={() => setNavigationOpen(true)}
      />

      {/* Golden-path position: capture → prove → handoff, server-derived
          (GET /api/ge/position). Hides itself when the API is unavailable. */}
      <PositionBand />

      {error && (
        <div className="px-6 py-2 bg-status-warning/10 border-b border-status-warning/20 text-status-warning-ink text-xs">
          API unavailable — {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <Sidebar route={currentRoute.route} open={navigationOpen} onClose={() => setNavigationOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Breadcrumbs route={currentRoute.route} params={currentRoute.params} />
          <ErrorBoundary label={currentRoute.route} resetKey={location.hash}>
            <Suspense fallback={<ViewFallback />}>
              {/* Calm view-enter transition: a 150ms fade + 2px rise keyed by the
                  route (and its params), enter-only — no exit choreography.
                  MotionConfig reducedMotion="user" drops the transform for
                  prefers-reduced-motion users. */}
              <MotionConfig reducedMotion="user">
                <motion.div
                  key={`${currentRoute.route}:${currentRoute.params.id ?? currentRoute.params.usecaseId ?? ""}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {renderView()}
                </motion.div>
              </MotionConfig>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <JobToast onDone={refresh} />
      <RunDrawer />
    </div>
    </RunFollowProvider>
    </ToastProvider>
    </QueryClientProvider>
    </AuthGate>
  );
}
