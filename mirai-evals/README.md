# Mirai AI — efficiency eval suite (100 prompts)

Exactly **100** Promptfoo prompts to measure whether Mirai answers **efficiently** across every connector **except WhatsApp**.

## Coverage

| Connector | Prompts | File |
| --- | --- | --- |
| Square | 6 | `tests/connectors/square.yaml` |
| Toast | 6 | `tests/connectors/toast.yaml` |
| Clover | 6 | `tests/connectors/clover.yaml` |
| Shopify | 6 | `tests/connectors/shopify.yaml` |
| Stripe | 6 | `tests/connectors/stripe.yaml` |
| Plaid | 6 | `tests/connectors/plaid.yaml` |
| QuickBooks | 6 | `tests/connectors/quickbooks.yaml` |
| Xero | 6 | `tests/connectors/xero.yaml` |
| Gmail | 6 | `tests/connectors/gmail.yaml` |
| Google Sheets | 6 | `tests/connectors/google-sheets.yaml` |
| Google Drive | 6 | `tests/connectors/google-drive.yaml` |
| Discord | 6 | `tests/connectors/discord.yaml` |
| Slack | 6 | `tests/connectors/slack.yaml` |
| Dodo | 6 | `tests/connectors/dodo.yaml` |
| Notion | 6 | `tests/connectors/notion.yaml` |
| Microsoft | 6 | `tests/connectors/microsoft.yaml` |
| Cross-connector | 4 | `tests/cross-efficiency.yaml` |
| **Total** | **100** | |

WhatsApp is intentionally excluded.

## Efficiency lenses (rotated on every connector)

1. **direct** — one-shot metric, minimal tokens  
2. **scoped** — top-N / exceptions only (no full dumps)  
3. **single_pass** — answer + task/draft in one turn, or `CLEAR`  
4. **locked** — stay on that connector only  
5. **compressed** — hard word/structure budget  
6. **idle** — if nothing material, reply exactly `CLEAR`

Catalog: `datasets/prompts-catalog.csv`

## Run

```bash
cd mirai-evals
npx promptfoo@latest eval -c promptfooconfig.smoke.yaml   # must be 100
# Point providers at Mirai, then:
npx promptfoo@latest eval && npx promptfoo@latest view
```

Graded runs need a model key for `llm-rubric`. Score efficiency on: brevity, connector discipline, cap respect, and correct `CLEAR` when idle.
