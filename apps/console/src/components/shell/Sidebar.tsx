import { NAV_ROUTES, activeNavId } from "../../lib/routes";

interface SidebarProps {
  route: string;
}

export function Sidebar({ route }: SidebarProps) {
  const active = activeNavId(route);
  return (
    <aside className="w-56 bg-surface border-r border-outline-variant/60 flex flex-col">
      <div className="px-5 pt-6 pb-3">
        <div className="text-3xs font-semibold uppercase tracking-widest text-secondary">Spec to deploy</div>
      </div>
      <div className="flex-1 py-2">
        <nav className="space-y-0.5 px-3">
          {NAV_ROUTES.map(({ id, hash, label, Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={hash}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                {isActive && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" aria-hidden />}
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
