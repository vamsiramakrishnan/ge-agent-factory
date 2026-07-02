import { useState } from "react";
import { FileText } from "lucide-react";
import { ge } from "../services/geClient";

interface ArtifactBrowserProps {
  runId: string | null;
  item: string;
  stage: string;
}

const ARTIFACTS: Record<string, string[]> = {
  validate: ["artifacts/validation-report.json"],
  preview: ["artifacts/workspace-doctor.json", "artifacts/workspace-repair.json", "artifacts/preview-report.json"],
  plan_deploy: ["artifacts/workspace-doctor.json", "artifacts/deploy-plan.json"],
  load_data: ["mock_data/cloud/load-report.json"],
  deploy_runtime: ["deployment_metadata.json"],
  register_tools: ["agent_registry_registration.json"],
  publish_enterprise: ["gemini_enterprise_registration.json"],
  verify_live: ["artifacts/live-verification-report.json"],
};

export function ArtifactBrowser({ runId, item, stage }: ArtifactBrowserProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const artifacts = ARTIFACTS[stage] || [];

  const handleSelect = async (name: string) => {
    if (!runId) return;
    setSelected(name);
    setLoading(true);
    setNotFound(false);
    setContent(null);

    try {
      const result = await ge.artifact(runId, item, name);
      if (!result.found) {
        setNotFound(true);
        setContent(null);
      } else {
        setNotFound(false);
        // Pretty-print JSON if parseable
        try {
          const parsed = JSON.parse(result.content);
          setContent(JSON.stringify(parsed, null, 2));
        } catch {
          setContent(result.content);
        }
      }
    } catch (err) {
      setContent(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-outline-variant">
      <div className="p-3 border-b border-outline-variant bg-surface-container">
        <h3 className="text-sm font-semibold text-on-surface">Artifacts</h3>
      </div>

      <div className="flex flex-col gap-1 p-2 border-b border-outline-variant bg-surface-container-low">
        {artifacts.length === 0 ? (
          <p className="text-xs text-secondary px-2 py-1">None for this stage</p>
        ) : (
          artifacts.map((name) => (
            <button
              key={name}
              disabled={!runId}
              onClick={() => handleSelect(name)}
              className={`text-left px-2 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-2 ${
                selected === name
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-on-surface hover:bg-surface-container-high disabled:text-secondary disabled:cursor-not-allowed"
              }`}
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{name}</span>
            </button>
          ))
        )}
      </div>

      <div className="flex-1 overflow-auto bg-surface p-3">
        {loading && <p className="text-sm text-secondary">Loading…</p>}
        {notFound && <p className="text-sm text-secondary">Artifact not found</p>}
        {content && (
          <pre className="text-xs text-on-surface font-mono whitespace-pre-wrap break-words">
            {content}
          </pre>
        )}
        {!loading && !content && !notFound && selected && (
          <p className="text-sm text-secondary">No content</p>
        )}
        {!selected && (
          <p className="text-sm text-secondary">Select an artifact to preview</p>
        )}
      </div>
    </div>
  );
}
