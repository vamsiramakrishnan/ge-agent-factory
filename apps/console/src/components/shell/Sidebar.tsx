import { X } from "lucide-react";
import { NAV_ROUTES, activeNavId } from "../../lib/routes";

interface SidebarProps {
  route: string;
  open?: boolean;
  onClose?: () => void;
}

function Navigation({ route, onNavigate }: { route: string; onNavigate?: () => void }) {
  const active = activeNavId(route);
  return (
    <>
      <div className="px-5 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <span className="engraved">spec to deploy</span>
          <span className="h-px flex-1 bg-outline-variant/70" aria-hidden />
        </div>
      </div>
      <div className="flex-1 py-2">
        <nav className="space-y-0.5 px-3" aria-label="Console">
          {NAV_ROUTES.map(({ id, hash, label, Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={hash}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary-container bg-surface-container-low text-primary"
                    : "border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function Sidebar({ route, open = false, onClose = () => {} }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-outline-variant/60 bg-surface md:flex">
        <Navigation route={route} />
      </aside>

      <div
        className={`fixed inset-x-0 bottom-0 top-14 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-on-surface/20 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-3rem))] flex-col border-r border-outline-variant bg-surface transition-transform motion-reduce:transition-none ${open ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Console navigation"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-3">
            <span className="engraved">navigation</span>
            <button
              type="button"
              className="key grid h-9 w-9 place-items-center border border-outline-variant"
              onClick={onClose}
              aria-label="Close navigation"
              title="Close navigation"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <Navigation route={route} onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}
