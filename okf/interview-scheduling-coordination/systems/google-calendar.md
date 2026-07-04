---
type: Source System
title: Google Calendar
description: "Interviewer availability, room bookings, time zone handling"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Google Calendar

Interviewer availability, room bookings, time zone handling

- **Protocol:** Workspace API
- **Local backing:** json-api, firestore

# Schema

- calendar_events
- invites
- availability_slots
- zoom_conference_links

## Tools using this system

- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [action_google_calendar_create_event](/tools/action-google-calendar-create-event.md)
