import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Laptop, Key, BarChart3, MessageCircle, Shield, Calendar, UserPlus, Eye } from "lucide-react";

export const EndUserComputingCatalog = () => (
  <DomainCatalogSlide
    title="End User Computing & Productivity"
    subtitle="Domain 46 • Enable"
    description="Empowering end users with seamless device lifecycle management, access provisioning, workspace analytics, and self-service IT support — reducing friction and boosting productivity."
    color="#a16207"
    useCases={[
      {
        id: "uc-4601",
        title: "Device Lifecycle Manager",
        icon: Laptop,
        description: "Tracks device inventory, manages refresh cycles, and coordinates provisioning/deprovisioning with HR events."
      },
      {
        id: "uc-4602",
        title: "Access Provisioning Orchestrator",
        icon: Key,
        description: "Receives HR events and provisions/modifies/revokes access across all systems based on role and department."
      },
      {
        id: "uc-4603",
        title: "Workspace Analytics Agent",
        icon: BarChart3,
        description: "Aggregates productivity tool usage metrics, collaboration patterns, and license utilization insights."
      },
      {
        id: "uc-4604",
        title: "Self-Service IT Bot",
        icon: MessageCircle,
        description: "Handles common IT requests including password resets, access requests, VPN troubleshooting, and printer setup."
      },
      {
        id: "uc-4605",
        title: "Endpoint Security Posture Agent",
        icon: Shield,
        description: "Scans endpoint compliance for OS patches, encryption, antivirus, and screen lock — flags non-compliant devices."
      },
      {
        id: "uc-4606",
        title: "Meeting Room & Resource Optimizer",
        icon: Calendar,
        description: "Analyzes room booking patterns, no-show rates, and capacity utilization to optimize workspace resources."
      },
      {
        id: "uc-4607",
        title: "Onboarding Tech Setup Orchestrator",
        icon: UserPlus,
        description: "Provisions accounts, configures laptops, and prepares welcome packages 5 days before new hire start date."
      },
      {
        id: "uc-4608",
        title: "Shadow IT Detector",
        icon: Eye,
        description: "Analyzes SSO bypass attempts, unsanctioned app usage, and unauthorized cloud storage with risk assessment."
      }
    ]}
  />
);
