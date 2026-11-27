// HearthLedger views: one render function per page. Each returns HTML;
// main.js wires the buttons after the HTML is in the page.

import { CATEGORIES, MONTH, MONTH_LABEL, PAST_MONTHS, categoryById, money, money0, monthTotals, niceDate, spentByCategory } from './data.js';
import { donutChart, barChart } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function budgetBar(spent, limit) {
  const pct = limit > 0 ? Math.min(100, Math.round(spent / limit * 100)) : 0;
  const cls = spent > limit ? 'bar over' : pct >= 80 ? 'bar warn' : 'bar';
  return `<div class="${cls}" role="img" aria-label="${pct}% of budget used"><span style="width:${pct}%"></span></div>
    <div class="small">${money(spent)} of ${money(limit)} · ${pct}% used${spent > limit ? ' — over budget' : ''}</div>`;
}

function txRow(t) {
  const cat = categoryById(t.category);
  return `<tr>
    <td>${niceDate(t.date)}</td>
    <td>${esc(t.note)}</td>
    <td><span class="tag ${t.type}">${esc(cat.name)}</span></td>
    <td class="num money ${t.type === 'income' ? 'pos' : 'neg'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td>
    <td class="num"><button class="danger" data-delete="${t.id}" type="button">Delete</button></td>
  </tr>`;
}

export function viewOverview(store) {
  const { income, spent, left } = monthTotals(store);
  const byCat = spentByCategory(store);
  const savingsRate = income > 0 ? Math.round(left / income * 100) : 0;
  const topCats = CATEGORIES.filter((c) => c.id !== 'income' && (byCat[c.id] || 0) > 0)
    .map((c) => ({ label: c.name, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const recent = [...store.transactions]
    .filter((t) => t.date.startsWith(MONTH))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 8);
  const budgetRows = CATEGORIES.filter((c) => c.id !== 'income' && store.budgets[c.id])
    .map((c) => {
      const s = byCat[c.id] || 0;
      return `<div class="budget-row"><div class="rowline"><strong>${esc(c.name)}</strong><span class="money">${money(s)} / ${money(store.budgets[c.id])}</span></div>${budgetBar(s, store.budgets[c.id])}</div>`;
    }).join('');
  const unpaid = store.bills.filter((b) => !b.paid);
  const nextBill = [...unpaid].sort((a, b) => a.due.localeCompare(b.due))[0];
  const legend = topCats.map((c) => `<li><span class="swatch" style="background:${c.color}"></span>${esc(c.label)} — <span class="money">${money(c.value)}</span></li>`).join('');

  return `<h1>November at a glance</h1>
  <p class="lede">Maya, Jon &amp; Leo — one household, one pot. Spending is running close to plan, and the family has kept ${money0(left)} of its income so far this month.</p>
  <div class="cards">
    <div class="stat"><div class="label">Money in</div><div class="big pos money">${money(income)}</div><div class="sub">Salaries + freelance</div></div>
    <div class="stat"><div class="label">Money out</div><div class="big neg money">${money(spent)}</div><div class="sub">25 entries so far</div></div>
    <div class="stat highlight"><div class="label">Left to save</div><div class="big money">${money(left)}</div><div class="sub">${savingsRate}% of income saved</div></div>
    <div class="stat"><div class="label">Next bill</div><div class="big" style="font-size:22px">${nextBill ? esc(nextBill.name.split(' — ')[0]) : 'All paid'}</div><div class="sub">${nextBill ? money(nextBill.amount) + ' due ' + niceDate(nextBill.due) : 'Nothing due in December'}</div></div>
  </div>
  <div class="grid2">
    <section class="panel"><h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(topCats)}
      <ul class="legend">${legend}</ul></div>
      <p class="small">Housing is the biggest slice, as usual — rent is fixed, so the lever the family can actually pull is groceries and eating out.</p>
      <p><a class="btn secondary" href="#/categories">See every category</a></p>
    </section>
    <section class="panel"><h2>Budget progress</h2>${budgetRows}
      <p><a class="btn secondary" href="#/categories">Change budget limits</a></p>
    </section>
  </div>
  <section class="panel"><h2>Recent entries</h2>
    <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${recent.map(txRow).join('')}</tbody></table>
    <p><a class="btn" href="#/add">+ Add an entry</a> <a class="btn secondary" href="#/categories">All entries</a></p>
  </section>
  ${unpaid.length ? `<div class="callout"><strong>${unpaid.length} bills still to pay in December</strong> — ${money(unpaid.reduce((s, b) => s + b.amount, 0))} in total. <a href="#/bills">Check the bills list</a>.</div>` : `<div class="callout good"><strong>All December bills are paid.</strong> Nice work.</div>`}`;
}

export function viewAdd(store) {
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  return `<h1>Add an entry</h1>
  <p class="lede">Log money in or out as it happens — a shop, a salary, a school trip. It shows up on the overview and in the charts straight away.</p>
  <div class="grid2">
  <form id="add-form" class="panel">
    <fieldset><legend>What happened?</legend>
      <label>Type
        <select name="type" id="f-type"><option value="expense">Money out (spending)</option><option value="income">Money in (income)</option></select>
      </label>
      <div class="formrow">
        <label>Amount ($)<input name="amount" id="f-amount" type="number" min="0.01" step="0.01" required placeholder="42.50"></label>
        <label>Date<input name="date" id="f-date" type="date" value="2026-11-27" required></label>
      </div>
      <label>Category<select name="category" id="f-category">${options}</select></label>
      <label>Note<input name="note" id="f-note" type="text" maxlength="90" required placeholder="e.g. Weekly shop — GreenMart"></label>
      <p><button type="submit">Save entry</button></p>
      <p class="small" id="add-msg" role="status"></p>
    </fieldset>
  </form>
  <section class="panel"><h2>How this household logs</h2>
    <p><strong>Three rules that keep it honest:</strong></p>
    <ol>
      <li>Log it the day it happens — receipts pile up and memories don't.</li>
      <li>Round numbers are fine for cash; card spending goes in to the cent.</li>
      <li>One entry per shop, not one per item — the category does the sorting.</li>
    </ol>
    <p class="small">November so far: ${store.transactions.filter((t) => t.date.startsWith(MONTH)).length} entries, ${money(monthTotals(store).spent)} spent, ${money(monthTotals(store).income)} in.</p>
    <p><a class="btn secondary" href="#/">Back to overview</a></p>
  </section>
  </div>`;
}

export function viewCategories(store, filter = 'all') {
  const byCat = spentByCategory(store);
  const chips = [{ id: 'all', name: 'All entries' }, ...CATEGORIES]
    .map((c) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${filter === c.id}">${esc(c.name)}</button>`).join('');
  const rows = [...store.transactions]
    .filter((t) => t.date.startsWith(MONTH))
    .filter((t) => filter === 'all' || t.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const total = rows.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
  const budgetForms = CATEGORIES.filter((c) => c.id !== 'income').map((c) => {
    const s = byCat[c.id] || 0;
    return `<div class="budget-row"><div class="rowline"><strong>${esc(c.name)}</strong><span class="money">${money(s)} spent</span></div>
    ${budgetBar(s, store.budgets[c.id] || 0)}
    <label>Monthly limit ($) <input type="number" min="0" step="10" value="${store.budgets[c.id] || 0}" data-budget="${c.id}"></label></div>`;
  }).join('');

  return `<h1>Categories &amp; budgets</h1>
  <p class="lede">Every dollar in November, grouped by what it was for. Tap a category to filter the list, or change a monthly limit — limits save when you leave the field.</p>
  <div class="chiprow" role="group" aria-label="Filter by category">${chips}</div>
  <div class="grid2">
    <section class="panel"><h2>Entries — ${filter === 'all' ? 'everything' : esc(categoryById(filter).name)}</h2>
      <p class="small">${rows.length} entries · net <span class="money ${total >= 0 ? 'pos' : 'neg'}">${total >= 0 ? '+' : '−'}${money(Math.abs(total))}</span></p>
      <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${rows.length ? rows.map(txRow).join('') : '<tr><td colspan="5">Nothing in this category yet this month.</td></tr>'}</tbody></table>
    </section>
    <section class="panel"><h2>Monthly budget limits</h2>${budgetForms}
      <p class="small" id="budget-msg" role="status">Total budgeted: ${money(Object.values(store.budgets).reduce((a, b) => a + b, 0))} a month. Limits are stored in this browser.</p>
    </section>
  </div>`;
}

export function viewCompare(store) {
  const current = monthTotals(store);
  const months = PAST_MONTHS.map((m) => m.month === MONTH
    ? { ...m, spent: current.spent, income: current.income }
    : m);
  const bars = months.map((m) => ({ label: m.label.split(' ')[0], value: m.spent, color: m.month === MONTH ? '#2e6b3e' : '#9db89a' }));
  const rows = months.map((m) => {
    const saved = m.income - m.spent;
    const rate = m.income > 0 ? Math.round(saved / m.income * 100) : 0;
    return `<tr><td>${esc(m.label)}${m.month === MONTH ? ' (so far)' : ''}</td><td class="num money">${money(m.income)}</td><td class="num money">${money(m.spent)}</td><td class="num money ${saved >= 0 ? 'pos' : 'neg'}">${money(saved)}</td><td class="num">${rate}%</td></tr>`;
  }).join('');
  const avgSpent = Math.round(months.slice(0, 3).reduce((s, m) => s + m.spent, 0) / 3);
  const vsAvg = current.spent - avgSpent;
  return `<h1>Month by month</h1>
  <p class="lede">Four months of the same household, side by side. November is still in progress — ${store.transactions.filter((t) => t.date.startsWith(MONTH)).length} entries logged so far — so compare it with care.</p>
  <section class="panel"><h2>Spending, Aug – Nov 2026</h2>${barChart(bars)}
  <p class="small">Green bar: November so far. October was the cheapest month (${money(3875)}); September the priciest (${money(4210)}), mostly a car repair and new school shoes.</p></section>
  <section class="panel"><h2>The numbers</h2>
  <table><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Saved %</th></tr></thead>
  <tbody>${rows}</tbody></table></section>
  ${vsAvg <= 0
    ? `<div class="callout good"><strong>November is running ${money(Math.abs(vsAvg))} under the Aug–Oct average spend (${money(avgSpent)}).</strong> If it holds, the family banks about ${money(current.left)} this month.</div>`
    : `<div class="callout alert"><strong>November is running ${money(vsAvg)} over the Aug–Oct average spend (${money(avgSpent)}).</strong> Groceries and the Thanksgiving shop are the main reason — worth a look before December.</div>`}
  <p><a class="btn secondary" href="#/categories">Dig into the categories</a></p>`;
}

export function viewGoals(store) {
  const totalSaved = store.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = store.goals.reduce((s, g) => s + g.target, 0);
  const cards = store.goals.map((g) => {
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    return `<section class="panel"><div class="goal-head"><h3>${esc(g.name)}</h3><span class="money">${money(g.saved)} / ${money(g.target)}</span></div>
    <div class="bar" role="img" aria-label="${pct}% saved"><span style="width:${pct}%"></span></div>
    <p class="small">${pct}% saved · ${money(g.target - g.saved)} to go</p>
    <p>${esc(g.note)}</p>
    <form class="goal-form" data-goal="${g.id}">
      <label>Add to this goal ($)<input type="number" min="1" step="1" name="amount" placeholder="50" required></label>
      <p><button class="small" type="submit">Add savings</button></p>
    </form></section>`;
  }).join('');
  return `<h1>Savings goals</h1>
  <p class="lede">Three things the family is saving for, with real money already set aside: ${money(totalSaved)} of ${money(totalTarget)} in total — ${Math.round(totalSaved / totalTarget * 100)}% of the way there.</p>
  <div class="grid2">${cards}</div>
  <section class="panel"><h2>Start a new goal</h2>
    <form id="goal-new">
      <div class="formrow">
        <label>Goal name<input name="name" type="text" maxlength="60" required placeholder="e.g. New bikes for spring"></label>
        <label>Target ($)<input name="target" type="number" min="10" step="10" required placeholder="500"></label>
      </div>
      <label>Why this goal? <input name="note" type="text" maxlength="120" placeholder="One line about what it is for"></label>
      <p><button type="submit">Create goal</button></p>
      <p class="small" id="goal-msg" role="status"></p>
    </form>
  </section>
  <div class="callout"><strong>How the family funds these:</strong> every payday, ${money(400)} moves to savings before anything else is spent — ${money(250)} to the emergency fund, ${money(100)} to the trip, ${money(50)} to the sofa. Pay yourself first, then live on the rest.</div>`;
}

export function viewBills(store) {
  const unpaid = store.bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
  const paid = store.bills.filter((b) => b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const today = '2026-11-27';
  const rows = (list, isPaid) => list.map((b) => {
    const daysLeft = Math.round((new Date(b.due + 'T12:00:00') - new Date(today + 'T12:00:00')) / 86400000);
    return `<tr>
      <td><strong>${esc(b.name)}</strong><br><span class="small">${esc(b.note)}</span></td>
      <td class="num money">${money(b.amount)}</td>
      <td>${niceDate(b.due)}${!isPaid && daysLeft <= 7 ? ` <span class="bill-due">· due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</span>` : ''}</td>
      <td>${isPaid ? '<span class="bill-paid">Paid ✓</span>' : `<button class="small" data-pay="${b.id}" type="button">Mark paid</button>`}</td>
    </tr>`;
  }).join('');
  return `<h1>Bills &amp; reminders</h1>
  <p class="lede">Everything the household owes in December, in due-date order. Mark a bill paid when the money leaves the account — it moves to the paid list and off the overview's next-bill card.</p>
  ${unpaid.length
    ? `<div class="callout"><strong>${unpaid.length} bills unpaid — ${money(unpaidTotal)} still to go out in December.</strong> The first is ${esc(unpaid[0].name)} (${money(unpaid[0].amount)}) on ${niceDate(unpaid[0].due)}.</div>`
    : `<div class="callout good"><strong>All bills paid.</strong> December is clear.</div>`}
  <section class="panel"><h2>Still to pay</h2>
    ${unpaid.length ? `<table><thead><tr><th>Bill</th><th class="num">Amount</th><th>Due</th><th></th></tr></thead><tbody>${rows(unpaid, false)}</tbody></table>` : '<p>Nothing outstanding.</p>'}
  </section>
  <section class="panel"><h2>Add a bill</h2>
    <form id="bill-form">
      <div class="formrow">
        <label>Bill name<input name="name" type="text" maxlength="80" required placeholder="e.g. Gym membership"></label>
        <label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="35"></label>
      </div>
      <div class="formrow">
        <label>Due date<input name="due" type="date" value="2026-12-10" required></label>
        <label>Note<input name="note" type="text" maxlength="120" placeholder="Anything to remember"></label>
      </div>
      <p><button type="submit">Add bill</button></p>
      <p class="small" id="bill-msg" role="status"></p>
    </form>
  </section>
  <section class="panel"><h2>Already paid</h2>
    <table><thead><tr><th>Bill</th><th class="num">Amount</th><th>Due</th><th></th></tr></thead><tbody>${rows(paid, true)}</tbody></table>
  </section>`;
}
