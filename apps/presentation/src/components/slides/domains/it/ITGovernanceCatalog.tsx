import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { ClipboardCheck, FolderSearch, FileText, CreditCard, AlertTriangle, Bell, BarChart3 } from "lucide-react";

export const ITGovernanceCatalog = () => (
  <DomainCatalogSlide
    title="IT Governance & Compliance"
    subtitle="Domain 45 • Govern"
    description="Ensuring IT operations meet regulatory requirements, internal policies, and audit standards through automated control testing, evidence collection, and risk management."
    color="#475569"
    useCases={[
      {
        id: "uc-4501",
        title: "IT Control Testing Agent",
        icon: ClipboardCheck,
        description: "Executes automated control tests, collects evidence, generates test workpapers, and tracks remediation."
      },
      {
        id: "uc-4502",
        title: "Audit Evidence Collector",
        icon: FolderSearch,
        description: "Maps audit requests to evidence sources, auto-collects artifacts, and organizes in audit-ready format."
      },
      {
        id: "uc-4503",
        title: "Policy Lifecycle Manager",
        icon: FileText,
        description: "Tracks policy review dates, distributes for review, collects approvals, and publishes updates."
      },
      {
        id: "uc-4504",
        title: "License Compliance Monitor",
        icon: CreditCard,
        description: "Compares license entitlements against actual usage, identifies over/under-licensing, and tracks true-up obligations."
      },
      {
        id: "uc-4505",
        title: "Risk Register Agent",
        icon: AlertTriangle,
        description: "Maintains IT risk register, tracks risk treatments, monitors KRIs, and generates risk reports."
      },
      {
        id: "uc-4506",
        title: "Regulatory Change Monitor",
        icon: Bell,
        description: "Scans regulatory feeds, assesses applicability, maps to existing controls, and notifies affected teams."
      },
      {
        id: "uc-4507",
        title: "IT GRC Dashboard & Reporter",
        icon: BarChart3,
        description: "Aggregates GRC metrics across risk, compliance, audit, and policy domains into executive reports."
      }
    ]}
  />
);
