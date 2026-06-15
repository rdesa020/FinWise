import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SignIn from './SignIn';
import SignUp from './SignUp';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import './style.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const CATEGORIES = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS = {
  Food:           'rgba(74,  222, 128, 0.8)',
  Transportation: 'rgba(96,  165, 250, 0.8)',
  Housing:        'rgba(244, 114, 182, 0.8)',
  Entertainment:  'rgba(192, 132, 252, 0.8)',
  Utilities:      'rgba(251, 146,  60, 0.8)',
  Healthcare:     'rgba(248, 113, 113, 0.8)',
  Education:      'rgba(34,  211, 238, 0.8)',
  Shopping:       'rgba(251, 191,  36, 0.8)',
  Other:          'rgba(148, 163, 184, 0.8)',
};

// ── Inline SVG Icons ──────────────────────────────────────────
const PlusIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ListIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3"/><line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3"/><line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3"/></svg>;
const BudgetIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/><path d="M3 21h18"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>;
const ChartIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const LogoutIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const DollarIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const TagIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3"/></svg>;
const FileIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const CalIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const EditIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const DownloadIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const XIcon         = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const LayersIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const TrendingIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

// ── Category Badge ────────────────────────────────────────────
function CategoryBadge({ category }) {
  return <span className={`badge badge-${category}`}>{category}</span>;
}

// ── Progress color helper ─────────────────────────────────────
function progressColor(pct) {
  if (pct >= 90) return 'red';
  if (pct >= 75) return 'yellow';
  return 'green';
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, handleLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img
            src="/FINWISE.png"
            alt="FinWise"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div className="sidebar-logo-text">
          <h2>FinWise</h2>
          <p>Personal Finance</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'addTransaction' ? 'active' : ''}`}
          onClick={() => setActiveTab('addTransaction')}
        >
          <PlusIcon /> Add Transaction
        </button>
        <button
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <ListIcon /> Transactions
        </button>
        <button
          className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          <BudgetIcon /> Budgets
        </button>
        <button
          className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <ChartIcon /> Financial Report
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={handleLogout}>
          <LogoutIcon /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
function MainApp() {
  const [transactions, setTransactions]   = useState([]);
  const [budgets, setBudgets]             = useState([]);
  const [form, setForm]                   = useState({ amount: '', category: '', description: '', date: '' });
  const [editForm, setEditForm]           = useState({ _id: '', amount: '', category: '', description: '', date: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [reportForm, setReportForm]       = useState({ startDate: '', endDate: '' });
  const [reportData, setReportData]       = useState(null);
  const [reportAttempted, setReportAttempted] = useState(false);
  const [sortField, setSortField]         = useState('date');
  const [sortDir, setSortDir]             = useState('desc');
  const [budgetForm, setBudgetForm]       = useState({ amount: '', category: '', month: '', year: String(new Date().getFullYear()) });
  const [activeTab, setActiveTab]         = useState('addTransaction');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  // ── API helpers ─────────────────────────────────────────────

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/budgets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  };

  // ── Add Transaction (new only) ───────────────────────────────
  const addTransaction = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form }),
      });

      if (res.ok) {
        const newTransaction = await res.json();
        const transactionMonth = newTransaction.date.slice(0, 7);
        const hasCategoryBudget = budgets.some(b => b.category === newTransaction.category);
        const budgetExistsInMonth = budgets.some(b => b.category === newTransaction.category && b.month === transactionMonth);

        if (hasCategoryBudget && !budgetExistsInMonth) {
          await fetch(`${API_BASE_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              category: newTransaction.category,
              amount: 0,
              month: transactionMonth,
              start_date: `${transactionMonth}-01`,
              end_date: `${transactionMonth}-31`,
            }),
          });
        }

        await fetchTransactions();
        await fetchBudgets();
        setForm({ amount: '', category: '', description: '', date: '' });
        setActiveTab('transactions');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  // ── Update Transaction (modal) ───────────────────────────────
  const updateTransaction = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        await fetchTransactions();
        await fetchBudgets();
        setShowEditModal(false);
        setEditForm({ _id: '', amount: '', category: '', description: '', date: '' });
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  // ── Delete Transaction ───────────────────────────────────────
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTransactions(prev => prev.filter(t => t._id !== id));
        fetchBudgets();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleEditClick = (t) => {
    setEditForm({
      _id: t._id,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: new Date(t.date).toLocaleDateString('en-CA'),
    });
    setShowEditModal(true);
  };

  // ── Add Budget ───────────────────────────────────────────────
  const addBudget = async () => {
    if (!budgetForm.month || !budgetForm.year || !budgetForm.category || !budgetForm.amount) {
      alert('Please fill all budget fields');
      return;
    }
    const token = localStorage.getItem('token');
    const monthNum = String(MONTHS.indexOf(budgetForm.month) + 1).padStart(2, '0');
    const monthStr = `${budgetForm.year}-${monthNum}`;
    const daysInMonth = new Date(parseInt(budgetForm.year), parseInt(monthNum), 0).getDate();

    try {
      const res = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          category: budgetForm.category,
          amount: parseFloat(budgetForm.amount),
          month: monthStr,
          start_date: `${monthStr}-01`,
          end_date: `${monthStr}-${daysInMonth}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save budget');
      }
      setBudgetForm({ amount: '', category: '', month: '', year: String(new Date().getFullYear()) });
      fetchBudgets();
    } catch (err) {
      console.error('Error adding budget:', err);
      alert(err.message || 'An error occurred while adding the budget');
    }
  };

  // ── Delete Budget ────────────────────────────────────────────
  const deleteBudget = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBudgets();
      } else {
        const data = await res.json();
        alert(data.message || 'Could not delete budget');
      }
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  // ── Financial Report ─────────────────────────────────────────
  const fetchReport = async () => {
    setReportAttempted(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/reports?startDate=${reportForm.startDate}&endDate=${reportForm.endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setReportData(null);
    }
  };

  const downloadReport = async () => {
    if (!reportData) return;
    const zip = new JSZip();
    let csv = `Total Spending,${reportData.totalSpending.toFixed(2)}\n\nCategory,Amount\n`;
    Object.entries(reportData.categoryBreakdown).forEach(([cat, amt]) => {
      csv += `${cat},${amt.toFixed(2)}\n`;
    });
    zip.file('Financial_Report.csv', csv);

    const chartEl = document.querySelector('.pie-chart-container canvas');
    if (chartEl) {
      html2canvas(chartEl).then(canvas => {
        canvas.toBlob(blob => {
          zip.file('Pie_Chart.png', blob);
          zip.generateAsync({ type: 'blob' }).then(zipBlob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'Financial_Report.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }, 'image/png');
      });
    } else {
      zip.generateAsync({ type: 'blob' }).then(zipBlob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'Financial_Report.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  // ── Sort Transactions ────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let va, vb;
    if (sortField === 'amount') { va = parseFloat(a.amount); vb = parseFloat(b.amount); }
    else { va = new Date(a.date); vb = new Date(b.date); }
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const sortIndicator = (field) => sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  // ── Donut Chart Data ─────────────────────────────────────────
  const getDonutData = () => {
    if (!reportData || !reportData.categoryBreakdown) return { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] };
    const sorted = Object.entries(reportData.categoryBreakdown).sort((a, b) => b[1] - a[1]);
    const cats = sorted.map(([c]) => c);
    const amts = sorted.map(([, a]) => a);
    return {
      labels: cats,
      datasets: [{
        data: amts,
        backgroundColor: cats.map(c => CATEGORY_COLORS[c] || 'rgba(150,150,150,0.9)'),
        borderColor: '#161d2b',
        borderWidth: 3,
      }],
    };
  };

  const sortedBreakdown = reportData
    ? Object.entries(reportData.categoryBreakdown).sort((a, b) => b[1] - a[1])
    : [];

  const topCategory = sortedBreakdown.length ? sortedBreakdown[0][0] : '—';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  // ── Budget filtering & sorting ───────────────────────────────
  const visibleBudgets = (selectedCategory === 'All' ? budgets : budgets.filter(b => b.category === selectedCategory))
    .slice()
    .sort((a, b) => new Date(b.month) - new Date(a.month));

  // ── Format date for table: "Jul 12, 2025" ───────────────────
  const formatDate = (raw) => {
    const [year, month, day] = raw.split('-');
    const m = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('default', { month: 'short' });
    return `${m} ${parseInt(day)}, ${year}`;
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

      <main className="main-content">

        {/* ── ADD TRANSACTION ─────────────────────────────────── */}
        {activeTab === 'addTransaction' && (
          <div>
            <div className="page-header">
              <h1>Add Transaction</h1>
              <p>Record a new expense to keep your finances on track.</p>
            </div>
            <div className="form-grid">
              <div className="card">
                <div className="form-field">
                  <label className="form-label"><DollarIcon /> Amount</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label"><TagIcon /> Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label"><FileIcon /> Description</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Grocery shopping at Trader Joe's"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label"><CalIcon /> Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <button className="btn-primary" onClick={addTransaction}>
                  <PlusIcon /> Add Transaction
                </button>
              </div>

              <div className="quick-reference">
                <h3>Quick Reference</h3>
                <p>Available categories for your transactions:</p>
                <div className="category-badges">
                  {CATEGORIES.map(c => <CategoryBadge key={c} category={c} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ────────────────────────────────────── */}
        {activeTab === 'transactions' && (
          <div>
            <div className="page-header">
              <h1>Transactions</h1>
            </div>
            <p className="transaction-count">{transactions.length} total transactions</p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')}>DATE{sortIndicator('date')}</th>
                    <th>DESCRIPTION</th>
                    <th>CATEGORY</th>
                    <th onClick={() => handleSort('amount')}>AMOUNT{sortIndicator('amount')}</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map(t => (
                    <tr key={t._id}>
                      <td><span className="date-text">{formatDate(t.date)}</span></td>
                      <td>{t.description}</td>
                      <td><CategoryBadge category={t.category} /></td>
                      <td><span className="amount-text">${parseFloat(t.amount).toFixed(2)}</span></td>
                      <td>
                        <div className="action-cell">
                          <button className="btn-icon edit" onClick={() => handleEditClick(t)} title="Edit">
                            <EditIcon />
                          </button>
                          <button className="btn-icon delete" onClick={() => deleteTransaction(t._id)} title="Delete">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BUDGETS ─────────────────────────────────────────── */}
        {activeTab === 'budgets' && (
          <div>
            <div className="page-header">
              <h1>Budgets</h1>
              <p>Set monthly spending limits by category.</p>
            </div>

            <div className="budget-add-form">
              <div className="budget-form-field">
                <label>Category</label>
                <select
                  className="form-input"
                  value={budgetForm.category}
                  onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}
                >
                  <option value="">Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="budget-form-field">
                <label>Budget Amount</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0.00"
                  value={budgetForm.amount}
                  onChange={e => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                />
              </div>
              <div className="budget-form-field">
                <label>Month</label>
                <select
                  className="form-input"
                  value={budgetForm.month}
                  onChange={e => setBudgetForm({ ...budgetForm, month: e.target.value })}
                >
                  <option value="">Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="budget-form-field">
                <label>Year</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="2026"
                  style={{ width: 100 }}
                  value={budgetForm.year}
                  onChange={e => setBudgetForm({ ...budgetForm, year: e.target.value })}
                />
              </div>
              <button className="btn-add-budget" onClick={addBudget}>+ Add</button>
            </div>

            <div className="budget-filter-tabs">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="budget-grid">
              {visibleBudgets.map(budget => {
                const [year, month] = budget.month.split('-').map(Number);
                const label = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' });
                const pct   = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
                const color = progressColor(pct);
                return (
                  <div key={budget._id} className="budget-card">
                    <div className="budget-card-header">
                      <CategoryBadge category={budget.category} />
                      <span className="budget-month">{label}</span>
                    </div>
                    <div className="budget-card-body">
                      <div className="budget-row">
                        <span className="label">Spent</span>
                        <span className="budget-spent-value">${budget.spent.toFixed(2)}</span>
                      </div>
                      <div className="budget-row">
                        <span className="label">Budget</span>
                        <span className="budget-amount-value">${budget.amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="budget-progress-bar">
                      <div className={`budget-progress-fill ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="budget-progress-meta">
                      <span className={`budget-pct ${color}`}>{pct.toFixed(0)}% used</span>
                      <span className="budget-remaining">${budget.remaining.toFixed(2)} left</span>
                    </div>
                    <div className="budget-card-footer">
                      <button className="btn-icon delete" onClick={() => deleteBudget(budget._id)} title="Delete budget">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FINANCIAL REPORT ────────────────────────────────── */}
        {activeTab === 'report' && (
          <div>
            <div className="page-header page-header-row">
              <div>
                <h1>Financial Report</h1>
                <p>Analyze your spending patterns.</p>
              </div>
              {reportData && (
                <button className="btn-export" onClick={downloadReport}>
                  <DownloadIcon /> Export Report
                </button>
              )}
            </div>

            <div className="report-date-form">
              <div className="report-date-field">
                <label>Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={reportForm.startDate}
                  onChange={e => setReportForm({ ...reportForm, startDate: e.target.value })}
                />
              </div>
              <div className="report-date-field">
                <label>End Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={reportForm.endDate}
                  onChange={e => setReportForm({ ...reportForm, endDate: e.target.value })}
                />
              </div>
              <button className="report-generate-btn" onClick={fetchReport}>Generate Report</button>
            </div>

            {reportAttempted && !reportData && (
              <div className="report-empty">No transactions found in this date range.</div>
            )}

            {reportData && (
              <>
                {/* 3 stat cards */}
                <div className="report-stats">
                  <div className="stat-card">
                    <div className="stat-icon"><DollarIcon /></div>
                    <div>
                      <div className="stat-label">Total Spending</div>
                      <div className="stat-value">${reportData.totalSpending.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon"><LayersIcon /></div>
                    <div>
                      <div className="stat-label">Categories</div>
                      <div className="stat-value">{sortedBreakdown.length}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon"><TrendingIcon /></div>
                    <div>
                      <div className="stat-label">Top Category</div>
                      <div className="stat-value">{topCategory}</div>
                    </div>
                  </div>
                </div>

                {/* Donut + Breakdown */}
                <div className="report-two-col">
                  <div className="card pie-chart-container">
                    <h3>Spending Distribution</h3>
                    <div style={{ width: 260, height: 260, margin: '0 auto' }}>
                      <Doughnut
                        data={getDonutData()}
                        options={{
                          cutout: '62%',
                          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: $${ctx.parsed.toFixed(2)}` } } },
                        }}
                      />
                    </div>
                    <div className="custom-legend">
                      {sortedBreakdown.map(([cat, amt]) => (
                        <div key={cat} className="legend-item">
                          <span className="legend-dot" style={{ background: CATEGORY_COLORS[cat] || '#94a3b8' }} />
                          <span className="legend-name">{cat}</span>
                          <span className="legend-amount">${amt.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h3>Category Breakdown</h3>
                    {sortedBreakdown.map(([cat, amt]) => {
                      const pct = ((amt / reportData.totalSpending) * 100).toFixed(1);
                      return (
                        <div key={cat} className="breakdown-row">
                          <div className="breakdown-row-header">
                            <CategoryBadge category={cat} />
                            <div className="breakdown-amounts">
                              <span className="breakdown-amount">${amt.toFixed(2)}</span>
                              <span className="pct-text">{pct}%</span>
                            </div>
                          </div>
                          <div className="breakdown-mini-bar">
                            <div
                              className="breakdown-mini-fill"
                              style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] || 'rgba(148,163,184,0.8)' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* ── EDIT MODAL ──────────────────────────────────────────── */}
      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Transaction</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><XIcon /></button>
            </div>
            <div className="modal-fields">
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Amount</label>
                <input
                  className="form-input"
                  type="number"
                  value={editForm.amount}
                  onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  type="text"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowEditModal(false)}>
                <XIcon /> Cancel
              </button>
              <button className="btn-modal-save" onClick={updateTransaction}>
                <CheckIcon /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main"   element={<MainApp />} />
        <Route path="/"       element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
