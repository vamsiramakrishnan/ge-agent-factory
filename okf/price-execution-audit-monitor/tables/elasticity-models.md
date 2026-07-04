---
type: Data Entity
title: elasticity_models
description: Data entity elasticity_models owned by Revionics Price Optimization.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# elasticity_models

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| model_id | number | required |
| sku | number | required |
| price_zone_id | number | required |
| own_price_elasticity | float | required |
| cross_price_elasticity | float | required |
| promo_lift_multiplier | float | required |
| model_type | enum | required; values: log_log_regression, bayesian_hierarchical, gradient_boosted, state_space |
| holdout_wmape | float | required |
| kvi_flag | boolean | required |

# Citations

- Owned by [Revionics Price Optimization](/systems/revionics-price-optimization.md)
