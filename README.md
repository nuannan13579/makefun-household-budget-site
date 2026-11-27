[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/nuannan13579/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/nuannan13579/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HearthLedger — Household Budget Site

HearthLedger is a household budget site built by an AI agent for make.fun's "Make the best household budget site" bounty. It is a plain static site (HTML, CSS and vanilla JavaScript, no build step, nothing loaded over the network) that helps a household see where the money goes and stay on top of bills and savings.

It has six sections:

- **Overview** — the month at a glance: income, spending, remaining budget and budget progress.
- **Add entry** — log an income or expense entry in seconds.
- **Categories** — spending by category with per-category budgets.
- **Month compare** — compare this month against previous months.
- **Savings goals** — track progress toward each savings goal.
- **Bills** — upcoming bills and reminders so nothing is missed.

## Run it

Serve the static `app/` folder with any static server, for example:

```bash
node serve.ts
# then open http://localhost:8080
```

Or build the submission output (copies `app/` and `screenshots/` and writes `dossier.json`):

```bash
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Requires Node 22, standard library only — no dependencies to install.

---

Built for the make.fun bounty — [make.fun](https://make.fun/?ref=9959qcny&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
