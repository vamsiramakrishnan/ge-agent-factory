import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Monitor, GitBranch, Workflow, ListFilter, Mail, Tag, ShieldCheck } from "lucide-react";

export const MarketingOperationsCatalog = () => (
  <DomainCatalogSlide
    title="Marketing Operations & MarTech"
    subtitle="Domain 36 • Marketing Operations"
    description="Optimizing the marketing technology stack, automating operational workflows, and ensuring data quality, deliverability, and compliance across all marketing systems."
    color="#475569"
    useCases={[
      {
        id: "uc-3601",
        title: "MarTech Stack Health Monitor",
        icon: Monitor,
        description: "Cross-system integration health monitoring with sync failure diagnosis and license utilization tracking."
      },
      {
        id: "uc-3602",
        title: "Lead Routing & Assignment Engine",
        icon: GitBranch,
        description: "Intelligent MQL-to-rep routing with account matching, territory rules, and ambiguous case resolution."
      },
      {
        id: "uc-3603",
        title: "Campaign Ops Workflow Builder",
        icon: Workflow,
        description: "Natural language to MAP workflow translation with branching logic, timing, and exclusion criteria."
      },
      {
        id: "uc-3604",
        title: "List Management & Segmentation Agent",
        icon: ListFilter,
        description: "Complex audience list building with suppression rules, cross-system filters, and dynamic segment maintenance."
      },
      {
        id: "uc-3605",
        title: "Email Deliverability Manager",
        icon: Mail,
        description: "Inbox placement monitoring with domain reputation tracking, root cause diagnosis, and remediation planning."
      },
      {
        id: "uc-3606",
        title: "UTM & Tracking Governance Agent",
        icon: Tag,
        description: "UTM naming convention enforcement with canonical deduplication and attribution data quality scoring."
      },
      {
        id: "uc-3607",
        title: "Marketing Compliance & Consent Manager",
        icon: ShieldCheck,
        description: "GDPR/CCPA/CAN-SPAM consent management with cross-system synchronization and regulatory impact analysis."
      }
    ]}
  />
);
