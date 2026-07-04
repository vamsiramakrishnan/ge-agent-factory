---
type: Query Capability
title: "Generate promotional copy adapted for email, social, and website. Post-event:..."
description: "Generate promotional copy adapted for email, social, and website. Post-event: analyze Q&A questions to identify hot topics. Draft personalized follow-up messages for high-intent attendees referencing specific discussion points."
source_id: "content-follow-up-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate promotional copy adapted for email, social, and website. Post-event: analyze Q&A questions to identify hot topics. Draft personalized follow-up messages for high-intent attendees referencing specific discussion points.

## Tools used

- [lookup_webinar_event_engine_playbook](/tools/lookup-webinar-event-engine-playbook.md)
- [action_zoom_generate](/tools/action-zoom-generate.md)

## Runs in

- [content_follow_up_generation](/workflow/content-follow-up-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/webinar-event-engine-end-to-end.md)

# Citations

- [Webinar & Event Engine Playbook](/documents/webinar-event-engine-playbook.md)
