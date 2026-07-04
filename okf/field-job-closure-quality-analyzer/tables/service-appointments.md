---
type: Data Entity
title: service_appointments
description: Data entity service_appointments owned by Oracle Field Service.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# service_appointments

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| appointment_id | number | required |
| work_order_number | number | required |
| customer_name | person.fullName | required |
| contact_email | internet.email | required |
| appointment_date | date | required |
| arrival_window | enum | required; values: am_8_10, am_10_12, pm_12_2, pm_2_4, pm_4_6 |
| appt_status | enum | required; values: booked, confirmed, en_route, completed, missed_customer_not_home, missed_tech_jeopardy, rescheduled |
| reschedule_count | number | required |
| sms_reminder_sent | boolean | required |

# Citations

- Owned by [Oracle Field Service](/systems/oracle-field-service.md)
