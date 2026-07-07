/**
 * Demo seed data for UI preview.
 *
 * To remove:
 * 1. Set USE_DEMO_DATA = false (or delete this folder)
 * 2. Clear localStorage key "budget-tracker-expenses" once
 */
export const USE_DEMO_DATA = true

export function isDemoId(id) {
  return id?.startsWith('demo-')
}

export const demoExpenses = [
  // ── June 2026 ──────────────────────────────────────────
  {
    id: 'demo-2026-06-02-food',
    name: 'Супермаркет',
    amount: 1840.5,
    category: 'food',
    date: '2026-06-02',
  },
  {
    id: 'demo-2026-06-05-transport',
    name: 'Паливо',
    amount: 2200,
    category: 'transport',
    date: '2026-06-05',
  },
  {
    id: 'demo-2026-06-08-food',
    name: 'Кавʼярня',
    amount: 145,
    category: 'food',
    date: '2026-06-08',
  },
  {
    id: 'demo-2026-06-11-entertainment',
    name: 'Кінотеатр',
    amount: 520,
    category: 'entertainment',
    date: '2026-06-11',
  },
  {
    id: 'demo-2026-06-14-shopping',
    name: 'Одяг',
    amount: 3299,
    category: 'shopping',
    date: '2026-06-14',
  },
  {
    id: 'demo-2026-06-17-food',
    name: 'Ресторан',
    amount: 890,
    category: 'food',
    date: '2026-06-17',
  },
  {
    id: 'demo-2026-06-20-transport',
    name: 'Таксі',
    amount: 310,
    category: 'transport',
    date: '2026-06-20',
  },
  {
    id: 'demo-2026-06-22-other',
    name: 'Аптека',
    amount: 465,
    category: 'other',
    date: '2026-06-22',
  },
  {
    id: 'demo-2026-06-25-entertainment',
    name: 'Концерт',
    amount: 1500,
    category: 'entertainment',
    date: '2026-06-25',
  },
  {
    id: 'demo-2026-06-28-food',
    name: 'Продукти',
    amount: 1120.75,
    category: 'food',
    date: '2026-06-28',
  },

  // ── July 2026 ──────────────────────────────────────────
  {
    id: 'demo-2026-07-01-food',
    name: 'Сніданок',
    amount: 210,
    category: 'food',
    date: '2026-07-01',
  },
  {
    id: 'demo-2026-07-02-transport',
    name: 'Метро',
    amount: 160,
    category: 'transport',
    date: '2026-07-02',
  },
  {
    id: 'demo-2026-07-03-shopping',
    name: 'Електроніка',
    amount: 4599,
    category: 'shopping',
    date: '2026-07-03',
  },
  {
    id: 'demo-2026-07-04-food',
    name: 'Обід',
    amount: 385,
    category: 'food',
    date: '2026-07-04',
  },
  {
    id: 'demo-2026-07-05-entertainment',
    name: 'Підписка',
    amount: 299,
    category: 'entertainment',
    date: '2026-07-05',
  },
  {
    id: 'demo-2026-07-06-other',
    name: 'Канцтовари',
    amount: 175,
    category: 'other',
    date: '2026-07-06',
  },
  {
    id: 'demo-2026-07-07-food',
    name: 'Кава',
    amount: 95,
    category: 'food',
    date: '2026-07-07',
  },
  {
    id: 'demo-2026-07-07-transport',
    name: 'Uber',
    amount: 240,
    category: 'transport',
    date: '2026-07-07',
  },
]
