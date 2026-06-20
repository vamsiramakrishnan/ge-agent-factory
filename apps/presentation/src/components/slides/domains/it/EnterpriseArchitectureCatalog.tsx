import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileText, Globe, GitBranch, Clock, Plug, ShieldCheck, Layout } from "lucide-react";

export const EnterpriseArchitectureCatalog = () => (
  <DomainCatalogSlide
    title="Enterprise Architecture"
    subtitle="Domain 44 • Architect"
    description="Governing the technology landscape through architecture decision records, API governance, dependency mapping, and standards compliance — ensuring every system fits a coherent whole."
    color="#0e7490"
    useCases={[
      {
        id: "uc-4401",
        title: "ADR Drafter",
        icon: FileText,
        description: "Drafts Architecture Decision Records with context from existing ADRs, system catalog, and technology radar."
      },
      {
        id: "uc-4402",
        title: "API Catalog & Governance",
        icon: Globe,
        description: "Catalogs APIs, enforces naming conventions, checks versioning policies, and tracks usage and deprecation."
      },
      {
        id: "uc-4403",
        title: "System Dependency Mapper",
        icon: GitBranch,
        description: "Builds and maintains system dependency graphs from APM traces, CMDB records, and code analysis."
      },
      {
        id: "uc-4404",
        title: "Technology Lifecycle Manager",
        icon: Clock,
        description: "Tracks technology versions, EOL dates, and migration paths with cost estimates and sunset planning."
      },
      {
        id: "uc-4405",
        title: "Integration Pattern Advisor",
        icon: Plug,
        description: "Recommends integration approaches based on volume, latency requirements, and reference architectures."
      },
      {
        id: "uc-4406",
        title: "Architecture Compliance Scanner",
        icon: ShieldCheck,
        description: "Scans codebases and infrastructure against architecture guardrails and flags violations with remediation."
      },
      {
        id: "uc-4407",
        title: "Reference Architecture Generator",
        icon: Layout,
        description: "Generates reference architecture proposals from existing patterns, standards, and constraints with cost estimates."
      }
    ]}
  />
);
