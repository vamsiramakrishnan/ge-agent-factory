import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Calculator, GitCompare, Receipt, FolderOpen, BookOpen, Percent, FileSearch, Radio } from "lucide-react";

export const TaxComplianceCatalog = () => (
  <DomainCatalogSlide
    title="Tax & Regulatory Compliance"
    subtitle="Domain 25 - Tax & Compliance"
    description="Transforming tax from quarterly fire drills to continuous compliance intelligence -- automated provision calculations, RAG-powered tax research, and LLM interpretation of complex treaty provisions and regulatory changes."
    color="#9f1239"
    useCases={[
      {
        id: "uc-2501",
        title: "Tax Provision Calculator",
        icon: Calculator,
        description: "Multi-jurisdiction ASC 740 provision with LLM interpretation of uncertain tax positions and probability assessments."
      },
      {
        id: "uc-2502",
        title: "Transfer Pricing Monitor",
        icon: GitCompare,
        description: "Arm's length benchmarking with LLM assessment of intercompany pricing against OECD guidelines and documentation."
      },
      {
        id: "uc-2503",
        title: "Sales & Use Tax Automation",
        icon: Receipt,
        description: "Jurisdiction determination and exemption handling with LLM interpretation of edge cases like SaaS taxability by state."
      },
      {
        id: "uc-2504",
        title: "Regulatory Filing Orchestrator",
        icon: FolderOpen,
        description: "Filing calendar management with XBRL validation and LLM review of disclosure completeness against ASC requirements."
      },
      {
        id: "uc-2505",
        title: "Tax Research Assistant",
        icon: BookOpen,
        description: "RAG over IRC, regulations, and internal tax memos with LLM-powered analysis of deductibility and precedent application."
      },
      {
        id: "uc-2506",
        title: "Withholding Tax Agent",
        icon: Percent,
        description: "Treaty rate determination with LLM interpretation of beneficial ownership provisions for cross-border payments."
      },
      {
        id: "uc-2507",
        title: "Tax Audit Prep Agent",
        icon: FileSearch,
        description: "Automated document collection with LLM-drafted audit responses citing specific regulatory sections and project-level nexus."
      },
      {
        id: "uc-2508",
        title: "Regulatory Change Monitor",
        icon: Radio,
        description: "Continuous regulatory feed monitoring with LLM impact assessment of new rules like Pillar Two on entity-level tax positions."
      }
    ]}
  />
);
