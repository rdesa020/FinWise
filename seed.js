require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./Models/Transaction');
const Budget = require('./Models/Budget');
const User = require('./Models/User');

// Pass email as arg: node seed.js you@email.com
// If no arg, seeds the first user found in the DB
const targetEmail = process.argv[2] || null;

const transactions = [
  // ── July 2025 ──────────────────────────────────────────────
  { amount: 1200.00, category: 'Housing',        date: '2025-07-01', description: 'July rent payment' },
  { amount:   60.00, category: 'Transportation', date: '2025-07-01', description: 'Monthly bus pass top-up' },
  { amount:  120.00, category: 'Education',      date: '2025-07-02', description: 'Online course subscription' },
  { amount:   89.50, category: 'Utilities',      date: '2025-07-03', description: 'Electric bill' },
  { amount:   45.99, category: 'Entertainment',  date: '2025-07-05', description: 'Netflix + Spotify subscriptions' },
  { amount:   79.99, category: 'Shopping',       date: '2025-07-06', description: 'New running shoes on sale' },
  { amount:   22.99, category: 'Entertainment',  date: '2025-07-07', description: 'Movie tickets' },
  { amount:   25.00, category: 'Healthcare',     date: '2025-07-08', description: 'Pharmacy prescription' },
  { amount:   15.00, category: 'Transportation', date: '2025-07-09', description: 'Uber to downtown' },
  { amount:   52.30, category: 'Food',           date: '2025-07-10', description: "Trader Joe's weekly groceries" },
  { amount:   34.50, category: 'Food',           date: '2025-07-11', description: 'Dinner at Thai restaurant' },
  { amount:    8.50, category: 'Food',           date: '2025-07-12', description: 'Morning coffee and pastry' },
  { amount:   48.75, category: 'Food',           date: '2025-07-15', description: 'Grocery run — Ralphs' },
  { amount:   12.00, category: 'Transportation', date: '2025-07-17', description: 'Lyft to airport' },
  { amount:   35.00, category: 'Shopping',       date: '2025-07-19', description: 'Amazon — desk supplies' },
  { amount:   18.50, category: 'Food',           date: '2025-07-22', description: 'Chipotle lunch' },
  { amount:   42.00, category: 'Healthcare',     date: '2025-07-24', description: 'Vitamin supplements' },
  { amount:   65.00, category: 'Utilities',      date: '2025-07-27', description: 'Internet bill' },
  { amount:   29.99, category: 'Entertainment',  date: '2025-07-29', description: 'Bowling night with friends' },

  // ── August 2025 ────────────────────────────────────────────
  { amount: 1200.00, category: 'Housing',        date: '2025-08-01', description: 'August rent payment' },
  { amount:   60.00, category: 'Transportation', date: '2025-08-01', description: 'Monthly bus pass' },
  { amount:   94.20, category: 'Utilities',      date: '2025-08-04', description: 'Electric bill' },
  { amount:   45.99, category: 'Entertainment',  date: '2025-08-05', description: 'Streaming subscriptions' },
  { amount:   63.40, category: 'Food',           date: '2025-08-06', description: 'Costco groceries' },
  { amount:  140.00, category: 'Shopping',       date: '2025-08-08', description: 'Back-to-school supplies' },
  { amount:   28.00, category: 'Food',           date: '2025-08-10', description: 'Sushi dinner' },
  { amount:   22.00, category: 'Transportation', date: '2025-08-12', description: 'Gas station fill-up' },
  { amount:   55.00, category: 'Healthcare',     date: '2025-08-14', description: 'Dentist co-pay' },
  { amount:   38.75, category: 'Food',           date: '2025-08-16', description: "Trader Joe's run" },
  { amount:   75.00, category: 'Education',      date: '2025-08-18', description: 'Textbook — Data Structures' },
  { amount:   19.99, category: 'Entertainment',  date: '2025-08-20', description: 'Mini golf outing' },
  { amount:   12.50, category: 'Food',           date: '2025-08-22', description: 'Boba tea run' },
  { amount:   88.00, category: 'Utilities',      date: '2025-08-25', description: 'Internet + phone bill' },
  { amount:   47.00, category: 'Shopping',       date: '2025-08-28', description: 'Target — household items' },

  // ── September 2025 ─────────────────────────────────────────
  { amount: 1200.00, category: 'Housing',        date: '2025-09-01', description: 'September rent payment' },
  { amount:   60.00, category: 'Transportation', date: '2025-09-01', description: 'Monthly bus pass' },
  { amount:   45.99, category: 'Entertainment',  date: '2025-09-05', description: 'Streaming subscriptions' },
  { amount:   91.80, category: 'Utilities',      date: '2025-09-06', description: 'Electric bill' },
  { amount:   56.20, category: 'Food',           date: '2025-09-08', description: "Trader Joe's weekly shop" },
  { amount:   32.00, category: 'Food',           date: '2025-09-10', description: 'Pizza night' },
  { amount:  200.00, category: 'Education',      date: '2025-09-11', description: 'Fall quarter lab fees' },
  { amount:   18.00, category: 'Transportation', date: '2025-09-13', description: 'Uber to campus' },
  { amount:   85.00, category: 'Shopping',       date: '2025-09-15', description: 'Fall wardrobe refresh' },
  { amount:   30.00, category: 'Healthcare',     date: '2025-09-17', description: 'Doctor visit co-pay' },
  { amount:   24.50, category: 'Food',           date: '2025-09-19', description: 'Brunch with friends' },
  { amount:   15.00, category: 'Entertainment',  date: '2025-09-21', description: 'Museum entry' },
  { amount:   42.60, category: 'Food',           date: '2025-09-24', description: 'Grocery haul' },
  { amount:   67.00, category: 'Utilities',      date: '2025-09-27', description: 'Internet bill' },
  { amount:   55.99, category: 'Shopping',       date: '2025-09-29', description: 'Amazon order' },

  // ── October 2025 ───────────────────────────────────────────
  { amount: 1200.00, category: 'Housing',        date: '2025-10-01', description: 'October rent payment' },
  { amount:   60.00, category: 'Transportation', date: '2025-10-01', description: 'Monthly bus pass' },
  { amount:   45.99, category: 'Entertainment',  date: '2025-10-05', description: 'Streaming subscriptions' },
  { amount:   88.40, category: 'Utilities',      date: '2025-10-06', description: 'Electric bill' },
  { amount:   71.30, category: 'Food',           date: '2025-10-08', description: 'Grocery run — Vons' },
  { amount:   95.00, category: 'Shopping',       date: '2025-10-10', description: 'Halloween costume & decor' },
  { amount:   22.00, category: 'Food',           date: '2025-10-12', description: 'Lunch — Panda Express' },
  { amount:  150.00, category: 'Education',      date: '2025-10-14', description: 'Online certification course' },
  { amount:   40.00, category: 'Healthcare',     date: '2025-10-16', description: 'Flu shot + vitamins' },
  { amount:   35.00, category: 'Transportation', date: '2025-10-18', description: 'Lyft rides (week)' },
  { amount:   18.99, category: 'Entertainment',  date: '2025-10-20', description: 'Haunted house tickets' },
  { amount:   48.00, category: 'Food',           date: '2025-10-23', description: "Trader Joe's groceries" },
  { amount:   65.00, category: 'Utilities',      date: '2025-10-26', description: 'Internet bill' },
  { amount:   33.50, category: 'Shopping',       date: '2025-10-29', description: 'Target run' },
];

// Budgets per month
const budgetTemplates = [
  { category: 'Housing',        amount: 1300 },
  { category: 'Food',           amount: 400 },
  { category: 'Transportation', amount: 150 },
  { category: 'Entertainment',  amount: 100 },
  { category: 'Utilities',      amount: 200 },
  { category: 'Healthcare',     amount: 100 },
  { category: 'Education',      amount: 250 },
  { category: 'Shopping',       amount: 200 },
];

const months = ['2025-07', '2025-08', '2025-09', '2025-10'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  // Find user
  const user = targetEmail
    ? await User.findOne({ email: targetEmail })
    : await User.findOne({});

  if (!user) {
    console.error('No user found. Sign up first at http://localhost:3000/signup then run: node seed.js your@email.com');
    process.exit(1);
  }
  console.log(`Seeding for user: ${user.email} (${user._id})`);

  // Clear existing data for this user
  await Transaction.deleteMany({ user_id: String(user._id) });
  await Budget.deleteMany({ user_id: user._id });
  console.log('Cleared existing transactions and budgets');

  // Insert transactions
  const txDocs = transactions.map(t => ({
    user_id: String(user._id),
    amount: t.amount,
    category: t.category,
    date: new Date(t.date),
    description: t.description,
  }));
  await Transaction.insertMany(txDocs);
  console.log(`Inserted ${txDocs.length} transactions`);

  // Build budgets with correct spent/remaining
  const budgetDocs = [];
  for (const month of months) {
    for (const tmpl of budgetTemplates) {
      const [year, mon] = month.split('-').map(Number);
      const startDate = new Date(year, mon - 1, 1);
      const endDate   = new Date(year, mon, 0);

      const spent = txDocs
        .filter(t => {
          const d = new Date(t.date);
          return t.category === tmpl.category && d >= startDate && d <= endDate;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      budgetDocs.push({
        user_id:    user._id,
        category:   tmpl.category,
        amount:     tmpl.amount,
        month:      month,
        start_date: startDate,
        end_date:   endDate,
        spent:      parseFloat(spent.toFixed(2)),
        remaining:  parseFloat((tmpl.amount - spent).toFixed(2)),
      });
    }
  }

  await Budget.insertMany(budgetDocs);
  console.log(`Inserted ${budgetDocs.length} budgets (${months.length} months × ${budgetTemplates.length} categories)`);

  console.log('\nDone! Refresh your app to see the demo data.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
