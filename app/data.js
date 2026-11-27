// HearthLedger data: one household's money for November 2026.
// Everything lives in localStorage under one key; the seed below is the
// family's real-looking starting point and is only written once.

export const STORAGE_KEY = 'hearthledger-v1';

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#33658a' },
  { id: 'groceries', name: 'Groceries', color: '#2e6b3e' },
  { id: 'transport', name: 'Transport', color: '#b98a1d' },
  { id: 'utilities', name: 'Utilities', color: '#6a5a8c' },
  { id: 'dining', name: 'Eating out', color: '#c25e3a' },
  { id: 'kids', name: 'Kids & school', color: '#3a8a7a' },
  { id: 'health', name: 'Health', color: '#a83226' },
  { id: 'fun', name: 'Fun & leisure', color: '#c98a2e' },
  { id: 'income', name: 'Income', color: '#2e6b3e' },
  { id: 'other', name: 'Other', color: '#8a8578' },
];

export const MONTH = '2026-11';
export const MONTH_LABEL = 'November 2026';

// Monthly budget limits per spending category, in dollars.
export const DEFAULT_BUDGETS = {
  housing: 1850, groceries: 720, transport: 260, utilities: 310,
  dining: 240, kids: 300, health: 180, fun: 150, other: 120,
};

// Past months, for the month-compare page: totals actually spent.
export const PAST_MONTHS = [
  { month: '2026-08', label: 'Aug 2026', income: 8240, spent: 3985 },
  { month: '2026-09', label: 'Sep 2026', income: 8360, spent: 4210 },
  { month: '2026-10', label: 'Oct 2026', income: 8490, spent: 3875 },
  { month: '2026-11', label: 'Nov 2026', income: 8470, spent: 0 }, // filled in live
];

function seedTransactions() {
  return [
    { id: 't01', date: '2026-11-01', type: 'income', category: 'income', note: 'Maya — salary, Northwind Studio', amount: 4850 },
    { id: 't02', date: '2026-11-01', type: 'expense', category: 'housing', note: 'Rent — Maple Court Apt 4B', amount: 1850 },
    { id: 't03', date: '2026-11-02', type: 'expense', category: 'groceries', note: 'Weekly shop — GreenMart', amount: 148.60 },
    { id: 't04', date: '2026-11-03', type: 'income', category: 'income', note: 'Jon — salary, City Transit Co.', amount: 3200 },
    { id: 't05', date: '2026-11-04', type: 'expense', category: 'utilities', note: 'Electric bill — October usage', amount: 132.40 },
    { id: 't06', date: '2026-11-05', type: 'expense', category: 'transport', note: 'Bus passes for Maya & Jon', amount: 96 },
    { id: 't07', date: '2026-11-06', type: 'expense', category: 'kids', note: 'Leo — school lunch plan', amount: 85 },
    { id: 't08', date: '2026-11-07', type: 'expense', category: 'groceries', note: 'Farmers market — veg & eggs', amount: 64.25 },
    { id: 't09', date: '2026-11-08', type: 'expense', category: 'dining', note: 'Family pizza night', amount: 42.80 },
    { id: 't10', date: '2026-11-09', type: 'expense', category: 'health', note: 'Pharmacy — Leo allergy meds', amount: 28.50 },
    { id: 't11', date: '2026-11-10', type: 'expense', category: 'groceries', note: 'Weekly shop — GreenMart', amount: 171.35 },
    { id: 't12', date: '2026-11-11', type: 'expense', category: 'transport', note: 'Fuel — family car', amount: 58.20 },
    { id: 't13', date: '2026-11-12', type: 'income', category: 'income', note: 'Maya — freelance logo job', amount: 420 },
    { id: 't14', date: '2026-11-13', type: 'expense', category: 'fun', note: 'Cinema — Leo + friends', amount: 36 },
    { id: 't15', date: '2026-11-14', type: 'expense', category: 'utilities', note: 'Internet — November', amount: 59 },
    { id: 't16', date: '2026-11-15', type: 'expense', category: 'kids', note: 'Leo — new winter boots', amount: 74.99 },
    { id: 't17', date: '2026-11-16', type: 'expense', category: 'groceries', note: 'Weekly shop — GreenMart', amount: 139.90 },
    { id: 't18', date: '2026-11-17', type: 'expense', category: 'dining', note: 'Lunch with Grandma Rosa', amount: 54.60 },
    { id: 't19', date: '2026-11-18', type: 'expense', category: 'health', note: 'Dentist check-up — Jon', amount: 45 },
    { id: 't20', date: '2026-11-19', type: 'expense', category: 'transport', note: 'Car service — oil & brakes check', amount: 89 },
    { id: 't21', date: '2026-11-20', type: 'expense', category: 'groceries', note: 'Thanksgiving prep — GreenMart', amount: 186.40 },
    { id: 't22', date: '2026-11-21', type: 'expense', category: 'fun', note: 'Board game — Family Game Night', amount: 29.95 },
    { id: 't23', date: '2026-11-22', type: 'expense', category: 'other', note: 'Gift — Aunt Priya birthday', amount: 40 },
    { id: 't24', date: '2026-11-24', type: 'expense', category: 'utilities', note: 'Water bill — November', amount: 47.80 },
    { id: 't25', date: '2026-11-25', type: 'expense', category: 'dining', note: 'Thanksgiving dinner groceries top-up', amount: 63.15 },
  ];
}

function seedGoals() {
  return [
    { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4350, note: 'Six months of essentials, kept in a separate savings account.' },
    { id: 'g2', name: 'Summer trip to the coast', target: 1800, saved: 920, note: 'Train tickets, a cottage for a week, and ice cream money.' },
    { id: 'g3', name: 'New sofa', target: 950, saved: 410, note: 'The old one has survived Leo, two cats and one red marker.' },
  ];
}

function seedBills() {
  return [
    { id: 'b1', name: 'Rent — Maple Court Apt 4B', amount: 1850, due: '2026-12-01', paid: true, note: 'Paid on the 1st, every month.' },
    { id: 'b2', name: 'Electric — City Power', amount: 128, due: '2026-12-05', paid: false, note: 'Estimate based on October usage.' },
    { id: 'b3', name: 'Internet — Fiber 300', amount: 59, due: '2026-12-08', paid: false, note: 'Auto-pay is off; pay by the 8th.' },
    { id: 'b4', name: 'Car insurance — SafeDrive', amount: 142, due: '2026-12-12', paid: false, note: 'Quarterly premium, next one in March.' },
    { id: 'b5', name: 'Leo — after-school club', amount: 120, due: '2026-12-15', paid: false, note: 'Art club, Tuesdays and Thursdays.' },
    { id: 'b6', name: 'Phone — family plan (3 lines)', amount: 96, due: '2026-12-18', paid: false, note: 'Maya, Jon and Grandma Rosa.' },
    { id: 'b7', name: 'Water — City Water', amount: 52, due: '2026-12-20', paid: false, note: 'Estimate; meter read on the 18th.' },
  ];
}

function seed() {
  return {
    transactions: seedTransactions(),
    budgets: { ...DEFAULT_BUDGETS },
    goals: seedGoals(),
    bills: seedBills(),
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch {
    // A broken stored value falls back to the seed.
  }
  const fresh = seed();
  saveStore(fresh);
  return fresh;
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  return loadStore();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function monthTotals(store, month = MONTH) {
  let income = 0;
  let spent = 0;
  for (const t of store.transactions) {
    if (!t.date.startsWith(month)) continue;
    if (t.type === 'income') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, left: income - spent };
}

export function spentByCategory(store, month = MONTH) {
  const out = {};
  for (const t of store.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(month)) continue;
    out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function niceDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
