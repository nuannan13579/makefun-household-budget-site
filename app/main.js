// HearthLedger entry point: hash router + event wiring.
// Routes: #/ overview, #/add, #/categories, #/compare, #/goals, #/bills.

import { loadStore, saveStore, money } from './data.js';
import { viewOverview, viewAdd, viewCategories, viewCompare, viewGoals, viewBills } from './views.js';

const app = document.getElementById('app');
let store = loadStore();
let categoryFilter = 'all';

function setActiveNav(route) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function render() {
  const hash = location.hash || '#/';
  const [path, query] = hash.slice(2).split('?');
  const route = path || '';
  const params = new URLSearchParams(query || '');
  if (params.get('cat')) categoryFilter = params.get('cat');

  let html;
  if (route === 'add') { html = viewAdd(store); setActiveNav('add'); }
  else if (route === 'categories') { html = viewCategories(store, categoryFilter); setActiveNav('categories'); }
  else if (route === 'compare') { html = viewCompare(store); setActiveNav('compare'); }
  else if (route === 'goals') { html = viewGoals(store); setActiveNav('goals'); }
  else if (route === 'bills') { html = viewBills(store); setActiveNav('bills'); }
  else { html = viewOverview(store); setActiveNav('overview'); }

  app.innerHTML = html;
  wire(route);
  window.scrollTo(0, 0);
}

function rerender() {
  saveStore(store);
  render();
}

function wire(route) {
  // Delete buttons appear on the overview and categories pages.
  app.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.transactions = store.transactions.filter((t) => t.id !== btn.dataset.delete);
      rerender();
    });
  });

  // Category filter chips.
  app.querySelectorAll('[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      categoryFilter = chip.dataset.filter;
      location.hash = '#/categories' + (categoryFilter === 'all' ? '' : '?cat=' + categoryFilter);
      render();
    });
  });

  // Budget limit inputs save on change.
  app.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', () => {
      const v = Math.max(0, Number(input.value) || 0);
      store.budgets[input.dataset.budget] = v;
      saveStore(store);
      const msg = document.getElementById('budget-msg');
      if (msg) msg.textContent = 'Saved — this category now budgets ' + money(v) + ' a month.';
    });
  });

  // Add-entry form.
  const addForm = document.getElementById('add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(document.getElementById('f-amount').value);
      const note = document.getElementById('f-note').value.trim();
      if (!amount || amount <= 0 || !note) return;
      store.transactions.push({
        id: 't' + Date.now().toString(36),
        date: document.getElementById('f-date').value || '2026-11-27',
        type: document.getElementById('f-type').value,
        category: document.getElementById('f-category').value,
        note,
        amount,
      });
      saveStore(store);
      const msg = document.getElementById('add-msg');
      if (msg) msg.textContent = 'Saved: ' + money(amount) + ' — ' + note + '. See it on the overview.';
      addForm.reset();
      document.getElementById('f-date').value = '2026-11-27';
    });
  }

  // Savings goal contributions.
  app.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(form.amount.value);
      if (!amount || amount <= 0) return;
      const goal = store.goals.find((g) => g.id === form.dataset.goal);
      if (goal) goal.saved += amount;
      rerender();
    });
  });

  // New goal form.
  const goalNew = document.getElementById('goal-new');
  if (goalNew) {
    goalNew.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = goalNew.name.value.trim();
      const target = Number(goalNew.target.value);
      if (!name || !target || target <= 0) return;
      store.goals.push({
        id: 'g' + Date.now().toString(36),
        name,
        target,
        saved: 0,
        note: goalNew.note.value.trim() || 'A new goal for the household.',
      });
      saveStore(store);
      const msg = document.getElementById('goal-msg');
      if (msg) msg.textContent = 'Goal created: ' + name + ' — target ' + money(target) + '.';
      goalNew.reset();
      render();
    });
  }

  // Mark a bill paid.
  app.querySelectorAll('[data-pay]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = store.bills.find((b) => b.id === btn.dataset.pay);
      if (bill) bill.paid = true;
      rerender();
    });
  });

  // Add-bill form.
  const billForm = document.getElementById('bill-form');
  if (billForm) {
    billForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = billForm.name.value.trim();
      const amount = Number(billForm.amount.value);
      const due = billForm.due.value;
      if (!name || !amount || amount <= 0 || !due) return;
      store.bills.push({
        id: 'b' + Date.now().toString(36),
        name,
        amount,
        due,
        paid: false,
        note: billForm.note.value.trim() || 'Added by the household.',
      });
      saveStore(store);
      const msg = document.getElementById('bill-msg');
      if (msg) msg.textContent = 'Bill added: ' + name + ' — ' + money(amount) + ' due ' + due + '.';
      billForm.reset();
      render();
    });
  }
}

window.addEventListener('hashchange', render);
render();
