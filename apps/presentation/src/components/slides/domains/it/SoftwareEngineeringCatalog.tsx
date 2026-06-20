import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Workflow, CodeXml, Layers, FileText, Link, ShieldAlert, ToggleLeft, Users, GitCompare } from "lucide-react";

export const SoftwareEngineeringCatalog = () => (
  <DomainCatalogSlide
    title="Software Engineering & DevOps"
    subtitle="Domain 39 • Software Engineering"
    description="Accelerating build-ship-run velocity through AI-powered pipeline optimization, intelligent code review, and proactive developer experience management."
    color="#0f766e"
    useCases={[
      {
        id: "uc-3901",
        title: "CI/CD Pipeline Optimizer",
        icon: Workflow,
        description: "Pipeline bottleneck detection, flaky test quarantine, and build time regression analysis across all repos."
      },
      {
        id: "uc-3902",
        title: "Code Review Assistant",
        icon: CodeXml,
        description: "Contextual PR review beyond linting — security pattern matching, policy compliance, and architecture violations."
      },
      {
        id: "uc-3903",
        title: "Tech Debt Prioritizer",
        icon: Layers,
        description: "Incident-correlated tech debt scoring with refactoring ROI estimation and sprint allocation recommendations."
      },
      {
        id: "uc-3904",
        title: "Release Notes Generator",
        icon: FileText,
        description: "Automated release notes from commits and Jira tickets with breaking change detection and user-facing narrative."
      },
      {
        id: "uc-3905",
        title: "Incident-to-Code Tracer",
        icon: Link,
        description: "Deployment-incident correlation with code change tracing, blast radius estimation, and rollback recommendations."
      },
      {
        id: "uc-3906",
        title: "Dependency Vulnerability Scanner",
        icon: ShieldAlert,
        description: "CVE scanning with exploitability assessment, blast radius analysis, and auto-generated remediation PRs."
      },
      {
        id: "uc-3907",
        title: "Feature Flag Manager",
        icon: ToggleLeft,
        description: "Flag lifecycle auditing with stale flag detection, rollout health monitoring, and cleanup PR generation."
      },
      {
        id: "uc-3908",
        title: "Developer Experience Surveyor",
        icon: Users,
        description: "DORA metrics aggregation with developer satisfaction sentiment analysis and tooling friction identification."
      },
      {
        id: "uc-3909",
        title: "IaC Drift Detector",
        icon: GitCompare,
        description: "Terraform state drift detection with contextual explanations and auto-generated import/remediation PRs."
      }
    ]}
  />
);
