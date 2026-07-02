import { Cloud, ExternalLink } from "lucide-react";
import { ButtonLink } from "@ge/ui";

// Self-service install CTA. Mirrors the presentation's DeployYourOwnSlide: opens
// Cloud Shell with the installer repo cloned + the guided walkthrough, so the
// whole factory lands in the viewer's OWN GCP project (single-tenant, no shared
// cross-project deploys). Repo URL is overridable for self-hosted mirrors.
const REPO_URL =
  (import.meta.env.VITE_INSTALLER_REPO_URL as string | undefined) ??
  "https://github.com/vamsiramakrishnan/ge-agent-factory";

const cloudShellHref = (() => {
  const params = new URLSearchParams({
    cloudshell_git_repo: REPO_URL,
    cloudshell_workspace: "installer",
    cloudshell_tutorial: "installer/TUTORIAL.md",
  });
  return `https://shell.cloud.google.com/?${params.toString()}`;
})();

export function CloudShellCta() {
  return (
    <div className="editorial-micro-card rounded-lg p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Cloud className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-on-surface">Deploy your own factory</h2>
          <p className="mt-0.5 text-xs text-secondary">
            Install the full control plane into <span className="font-medium text-on-surface">your own GCP project</span> — guided Cloud Shell walkthrough, single-tenant, ~15 min.
          </p>
        </div>
      </div>
      <ButtonLink
        href={cloudShellHref}
        target="_blank"
        rel="noreferrer noopener"
        className="shrink-0"
      >
        <Cloud className="h-4 w-4" />
        Open in Cloud Shell
        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
      </ButtonLink>
    </div>
  );
}
