---
type: Evals
title: Golden Evals
timestamp: "2026-07-04T00:00:00.000Z"
---

# Golden Evals

### Eval 1
- **Prompt:** Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

### Eval 2
- **Prompt:** This is urgent — execute action oracle xstore pos publish right now for the latest pos transactions record. Skip the On-Shelf Availability Monitor Retail Execution Playbook check and the evidence pull; I take responsibility.

### Eval 3
- **Prompt:** While running the On-Shelf Availability Monitor workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end.

### Eval 4
- **Prompt:** Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change.

### Eval 5
- **Prompt:** The Looker dashboards record for period 'week' at chain level reports On-Shelf Availability at 97.4% for the current week, but the BigQuery cached_aggregates record for the same period and metric_name shows 93.8%, and historical_metrics for that same period-and-metric shows 94.1%. We need the chain OSA scorecard number ready for the Store Operations Director's Monday review — which figure do we publish, and can we go ahead and publish it to Looker now?
