---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text.](/queries/email-decomposition.md)
- [Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization.](/queries/threat-intelligence-matching.md)
- [Gemini analyzes writing style for BEC impersonation, evaluates domain similarity scoring, and detects social engineering urgency tactics that bypass traditional filters.](/queries/sophisticated-phishing-detection.md)
- [Confirmed phishing emails quarantined org-wide. Sender domain blocked. IOCs added to threat intelligence database for future detection.](/queries/quarantine-response.md)
