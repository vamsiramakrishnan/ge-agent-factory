import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Shield, Target, ShieldAlert, Mail, UserX, ClipboardCheck, Bug, Siren, Lock } from "lucide-react";

export const CybersecurityCatalog = () => (
  <DomainCatalogSlide
    title="Cybersecurity & Threat Management"
    subtitle="Domain 41 • SECURE"
    description="Transforming security operations from reactive alert triage to proactive threat intelligence with AI-driven detection, automated response, and continuous compliance posture monitoring."
    color="#dc2626"
    useCases={[
      {
        id: "uc-4101",
        title: "Threat Intelligence Aggregator",
        icon: Shield,
        description: "Continuous threat feed ingestion with IOC-to-asset correlation and MITRE ATT&CK-mapped threat briefs."
      },
      {
        id: "uc-4102",
        title: "Vulnerability Prioritization Agent",
        icon: Target,
        description: "Multi-scanner aggregation with EPSS exploitability scoring and business-context risk ranking."
      },
      {
        id: "uc-4103",
        title: "SIEM Alert Triage Agent",
        icon: ShieldAlert,
        description: "Context-enriched alert classification that auto-resolves 92% of alerts, surfacing only true threats."
      },
      {
        id: "uc-4104",
        title: "Phishing & Email Threat Analyzer",
        icon: Mail,
        description: "BEC detection using writing style analysis and domain spoofing with org-wide quarantine."
      },
      {
        id: "uc-4105",
        title: "Identity & Access Anomaly Detector",
        icon: UserX,
        description: "UBA-powered anomaly detection with real-time HR event correlation for orphaned account detection."
      },
      {
        id: "uc-4106",
        title: "Compliance Posture Scanner",
        icon: ClipboardCheck,
        description: "Automated CIS/SOC2/ISO compliance checks with audit-ready narrative reports and evidence packages."
      },
      {
        id: "uc-4107",
        title: "Penetration Test Findings Tracker",
        icon: Bug,
        description: "Auto-parsed pentest reports with Jira ticket creation, SLA tracking, and interim mitigation guidance."
      },
      {
        id: "uc-4108",
        title: "Security Incident Responder",
        icon: Siren,
        description: "MITRE ATT&CK kill chain reconstruction with dynamic playbook generation and automated containment."
      },
      {
        id: "uc-4109",
        title: "Zero Trust Policy Evaluator",
        icon: Lock,
        description: "Continuous zero trust maturity assessment across identity, network, and device layers with migration roadmap."
      }
    ]}
  />
);
