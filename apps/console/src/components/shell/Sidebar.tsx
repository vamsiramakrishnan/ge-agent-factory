import { NAV_ROUTES, activeNavId } from "../../lib/routes";

interface SidebarProps {
  route: string;
}

export function Sidebar({ route }: SidebarProps) {
  const active = activeNavId(route);
  return (
    <aside className="w-56 bg-surface border-r border-outline-variant/30 flex flex-col">
      <div className="px-5 pt-6 pb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Spec to Deploy</div>
      </div>
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {NAV_ROUTES.map(({ id, hash, label, Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={hash}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
