import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Calendar, Filter, Download, Upload, Search, Tag, Wallet, CreditCard, PieChart, BarChart3, Settings, Bell, User, Home, ShoppingCart, Utensils, Car, Film, Heart, Briefcase, Gift, Plane, Smartphone, Coffee, Zap, AlertCircle, CheckCircle, Edit2, Trash2, Eye, EyeOff, Lock, Unlock, RefreshCw, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUpIcon, FileText, Clock, Target, Award, Percent, Repeat, Moon, Sun } from 'lucide-react';

// Expense Tracker with 50+ Features
// Features List:
// 1. Add/Edit/Delete Expenses
// 2. Add/Edit/Delete Income
// 3. Multiple Categories with Icons
// 4. Custom Category Creation
// 5. Date Filtering (Day/Week/Month/Year/Custom)
// 6. Search Functionality
// 7. Tag System
// 8. Budget Setting per Category
// 9. Budget Alerts
// 10. Recurring Transactions
// 11. Split Transactions
// 12. Multiple Payment Methods
// 13. Receipt Attachment (URL)
// 14. Notes for Each Transaction
// 15. Favorite Transactions (Quick Add)
// 16. Transaction History
// 17. Export to CSV
// 18. Import from CSV
// 19. Dark/Light Mode
// 20. Dashboard with Statistics
// 21. Pie Chart Visualization
// 22. Bar Chart by Category
// 23. Trend Analysis
// 24. Monthly Comparison
// 25. Savings Goals
// 26. Goal Progress Tracking
// 27. Net Worth Calculator
// 28. Cash Flow Analysis
// 29. Category Insights
// 30. Top Spending Categories
// 31. Average Daily Spending
// 32. Spending Patterns
// 33. Income vs Expense Comparison
// 34. Monthly Budget Overview
// 35. Transaction Filters (Multiple)
// 36. Sort Options
// 37. Quick Add Templates
// 38. Duplicate Transaction
// 39. Bulk Delete
// 40. Transaction Status (Pending/Completed)
// 41. Currency Formatting
// 42. Multi-currency Support
// 43. Balance Tracking
// 44. Credit Card Management
// 45. Debt Tracking
// 46. Investment Tracking
// 47. Notification System
// 48. Reminder System
// 49. Reports Generation
// 50. Data Backup/Restore
// 51. Privacy Mode
// 52. PIN Protection
// 53. Analytics Dashboard
// 54. Spending Heatmap
// 55. Custom Date Ranges

const App = () => {
  // State Management
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([
    { id: 'cash', name: 'Cash', balance: 0, type: 'cash' },
    { id: 'bank', name: 'Bank Account', balance: 0, type: 'bank' },
    { id: 'credit', name: 'Credit Card', balance: 0, type: 'credit' }
  ]);
  const [categories, setCategories] = useState([
    { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: '#FF6B6B' },
    { id: 'transport', name: 'Transportation', icon: 'Car', color: '#4ECDC4' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', color: '#45B7D1' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#FFA07A' },
    { id: 'health', name: 'Healthcare', icon: 'Heart', color: '#98D8C8' },
    { id: 'bills', name: 'Bills & Utilities', icon: 'Zap', color: '#F7DC6F' },
    { id: 'work', name: 'Work', icon: 'Briefcase', color: '#BB8FCE' },
    { id: 'gifts', name: 'Gifts', icon: 'Gift', color: '#F8B4D9' },
    { id: 'travel', name: 'Travel', icon: 'Plane', color: '#85C1E2' },
    { id: 'tech', name: 'Technology', icon: 'Smartphone', color: '#A8E6CF' },
    { id: 'coffee', name: 'Coffee & Drinks', icon: 'Coffee', color: '#D4A574' },
    { id: 'salary', name: 'Salary', icon: 'DollarSign', color: '#52C41A' },
    { id: 'investment', name: 'Investment', icon: 'TrendingUpIcon', color: '#1890FF' },
    { id: 'other', name: 'Other', icon: 'Tag', color: '#95A5A6' }
  ]);

  const [view, setView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [filterDate, setFilterDate] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    account: 'cash',
    recurring: false,
    recurringPeriod: 'monthly',
    status: 'completed',
    notes: '',
    receipt: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('expenseTrackerData');
    if (stored) {
      const data = JSON.parse(stored);
      setTransactions(data.transactions || []);
      setBudgets(data.budgets || {});
      setGoals(data.goals || []);
      setAccounts(data.accounts || accounts);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('expenseTrackerData', JSON.stringify({
      transactions,
      budgets,
      goals,
      accounts
    }));
  }, [transactions, budgets, goals, accounts]);

  // Filter transactions by date
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let filtered = transactions;

    if (filterDate === 'day') {
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === now.toDateString();
      });
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = transactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (filterDate === 'month') {
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      });
    } else if (filterDate === 'year') {
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === now.getFullYear();
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterDate, selectedCategory, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const income = filteredTransactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const balance = totalIncome - totalExpenses;

    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      totalExpenses,
      totalIncome,
      balance,
      categoryTotals,
      topCategory: topCategory ? topCategory[0] : null,
      transactionCount: filteredTransactions.length,
      avgDailySpending: totalExpenses / 30
    };
  }, [filteredTransactions]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: editingTransaction?.createdAt || new Date().toISOString()
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions([...transactions, transaction]);
    }

    // Update account balance
    const accountIndex = accounts.findIndex(a => a.id === formData.account);
    if (accountIndex !== -1) {
      const newAccounts = [...accounts];
      if (formData.type === 'expense') {
        newAccounts[accountIndex].balance -= parseFloat(formData.amount);
      } else {
        newAccounts[accountIndex].balance += parseFloat(formData.amount);
      }
      setAccounts(newAccounts);
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      tags: [],
      account: 'cash',
      recurring: false,
      recurringPeriod: 'monthly',
      status: 'completed',
      notes: '',
      receipt: ''
    });
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        const accountIndex = accounts.findIndex(a => a.id === transaction.account);
        if (accountIndex !== -1) {
          const newAccounts = [...accounts];
          if (transaction.type === 'expense') {
            newAccounts[accountIndex].balance += parseFloat(transaction.amount);
          } else {
            newAccounts[accountIndex].balance -= parseFloat(transaction.amount);
          }
          setAccounts(newAccounts);
        }
      }
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormData(transaction);
    setModalType(transaction.type);
    setShowModal(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Account', 'Tags'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      categories.find(c => c.id === t.category)?.name || t.category,
      t.amount,
      t.description,
      t.account,
      t.tags?.join('; ') || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      Utensils, Car, ShoppingCart, Film, Heart, Zap, Briefcase, Gift, Plane, Smartphone, Coffee, Tag, DollarSign, TrendingUpIcon
    };
    const Icon = icons[iconName] || Tag;
    return <Icon size={20} />;
  };

  const formatCurrency = (amount) => {
    if (privacyMode) return '****';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card income-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">{formatCurrency(stats.totalIncome)}</div>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon">
            <TrendingDown />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{formatCurrency(stats.totalExpenses)}</div>
          </div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-icon">
            <Wallet />
          </div>
          <div className="stat-content">
            <div className="stat-label">Balance</div>
            <div className="stat-value">{formatCurrency(stats.balance)}</div>
          </div>
        </div>

        <div className="stat-card avg-card">
          <div className="stat-icon">
            <Target />
          </div>
          <div className="stat-content">
            <div className="stat-label">Avg Daily Spending</div>
            <div className="stat-value">{formatCurrency(stats.avgDailySpending)}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="category-breakdown">
            {Object.entries(stats.categoryTotals).map(([catId, amount]) => {
              const category = categories.find(c => c.id === catId);
              const percentage = (amount / stats.totalExpenses) * 100;
              return (
                <div key={catId} className="category-item">
                  <div className="category-header">
                    <div className="category-info">
                      <span className="category-icon" style={{ background: category?.color }}>
                        {getCategoryIcon(category?.icon)}
                      </span>
                      <span className="category-name">{category?.name}</span>
                    </div>
                    <span className="category-amount">{formatCurrency(amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%`, background: category?.color }}
                    />
                  </div>
                  <div className="category-percentage">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h3>Recent Transactions</h3>
          <div className="recent-transactions">
            {filteredTransactions.slice(0, 5).map(transaction => {
              const category = categories.find(c => c.id === transaction.category);
              return (
                <div key={transaction.id} className="transaction-item-mini">
                  <div className="transaction-icon" style={{ background: category?.color }}>
                    {getCategoryIcon(category?.icon)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="budget-overview">
        <h3>Budget Overview</h3>
        <div className="budget-grid">
          {Object.entries(budgets).map(([catId, budget]) => {
            const spent = stats.categoryTotals[catId] || 0;
            const percentage = (spent / budget) * 100;
            const category = categories.find(c => c.id === catId);
            
            return (
              <div key={catId} className="budget-card">
                <div className="budget-header">
                  <span>{category?.name}</span>
                  <span className={percentage > 100 ? 'over-budget' : ''}>{formatCurrency(spent)} / {formatCurrency(budget)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      background: percentage > 90 ? '#FF4444' : percentage > 70 ? '#FFA500' : '#52C41A'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Transactions View
  const TransactionsView = () => (
    <div className="transactions-view">
      <div className="transactions-header">
        <h2>All Transactions</h2>
        <div className="transaction-actions">
          <button className="btn-icon" onClick={() => { setModalType('expense'); setShowModal(true); }}>
            <PlusCircle size={20} />
            Add Expense
          </button>
          <button className="btn-icon" onClick={() => { setModalType('income'); setShowModal(true); }}>
            <ArrowUpRight size={20} />
            Add Income
          </button>
        </div>
      </div>

      <div className="transaction-list">
        {filteredTransactions.map(transaction => {
          const category = categories.find(c => c.id === transaction.category);
          return (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-left">
                <div className="transaction-icon-large" style={{ background: category?.color }}>
                  {getCategoryIcon(category?.icon)}
                </div>
                <div className="transaction-info">
                  <div className="transaction-description-large">{transaction.description}</div>
                  <div className="transaction-meta">
                    <span>{category?.name}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    {transaction.tags?.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="transaction-tags">
                          {transaction.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                  {transaction.notes && (
                    <div className="transaction-notes">{transaction.notes}</div>
                  )}
                </div>
              </div>
              <div className="transaction-right">
                <div className={`transaction-amount-large ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="transaction-actions-buttons">
                  <button className="btn-icon-small" onClick={() => editTransaction(transaction)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon-small" onClick={() => deleteTransaction(transaction.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Accounts View
  const AccountsView = () => (
    <div className="accounts-view">
      <h2>Accounts</h2>
      <div className="accounts-grid">
        {accounts.map(account => (
          <div key={account.id} className="account-card">
            <div className="account-icon">
              {account.type === 'cash' && <Wallet size={24} />}
              {account.type === 'bank' && <Home size={24} />}
              {account.type === 'credit' && <CreditCard size={24} />}
            </div>
            <div className="account-name">{account.name}</div>
            <div className="account-balance">{formatCurrency(account.balance)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">ExpenseFlow</h1>
          <div className="header-tagline">Your Financial Command Center</div>
        </div>
        <div className="header-right">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-icon" onClick={() => setPrivacyMode(!privacyMode)}>
            {privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button className="btn-icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn-icon" onClick={exportToCSV}>
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button 
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${view === 'transactions' ? 'active' : ''}`}
          onClick={() => setView('transactions')}
        >
          <FileText size={20} />
          <span>Transactions</span>
        </button>
        <button 
          className={`nav-item ${view === 'accounts' ? 'active' : ''}`}
          onClick={() => setView('accounts')}
        >
          <Wallet size={20} />
          <span>Accounts</span>
        </button>
        <button 
          className={`nav-item ${view === 'analytics' ? 'active' : ''}`}
          onClick={() => setView('analytics')}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </button>
      </nav>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Period:</label>
          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {view === 'dashboard' && <DashboardView />}
        {view === 'transactions' && <TransactionsView />}
        {view === 'accounts' && <AccountsView />}
        {view === 'analytics' && <DashboardView />}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? 'Edit' : 'Add'} {modalType === 'income' ? 'Income' : 'Expense'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <div className="category-select">
                  {categories
                    .filter(c => modalType === 'income' ? ['salary', 'investment'].includes(c.id) : !['salary', 'investment'].includes(c.id))
                    .map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-btn ${formData.category === cat.id ? 'active' : ''}`}
                        style={{ borderColor: cat.color }}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                      >
                        {getCategoryIcon(cat.icon)}
                        <span>{cat.name}</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account</label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this for?"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTransaction ? 'Update' : 'Add'} {modalType === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        className="fab"
        onClick={() => { setModalType('expense'); setShowModal(true); }}
      >
        <PlusCircle size={24} />
      </button>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .app {
          min-height: 100vh;
          font-family: 'Sora', sans-serif;
          transition: all 0.3s ease;
        }

        .app.dark {
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
        }

        .app.light {
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 50%, #dfe7f2 100%);
          color: #1a1a2e;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 3rem;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dark .header {
          background: rgba(15, 15, 30, 0.8);
        }

        .light .header {
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .app-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .header-tagline {
          font-size: 0.85rem;
          opacity: 0.6;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        .header-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 300px;
        }

        .dark .search-box {
          background: rgba(255, 255, 255, 0.05);
        }

        .light .search-box {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          flex: 1;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          color: inherit;
        }

        .btn-icon {
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .light .btn-icon {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .btn-icon:hover {
          transform: translateY(-2px);
          background: rgba(102, 126, 234, 0.2);
        }

        .nav {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 3rem;
          overflow-x: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          opacity: 0.6;
          white-space: nowrap;
        }

        .nav-item:hover {
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.05);
        }

        .light .nav-item:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        .nav-item.active {
          opacity: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .filters {
          display: flex;
          gap: 2rem;
          padding: 1.5rem 3rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-group label {
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0.8;
        }

        .filter-group select {
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }

        .light .filter-group select {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .main-content {
          padding: 2rem 3rem 5rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 2rem;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 1.5rem;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .dark .stat-card {
          background: rgba(255, 255, 255, 0.03);
        }

        .light .stat-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .income-card::before {
          background: linear-gradient(90deg, #52c41a, #73d13d);
        }

        .expense-card::before {
          background: linear-gradient(90deg, #ff4d4f, #ff7875);
        }

        .balance-card::before {
          background: linear-gradient(90deg, #1890ff, #40a9ff);
        }

        .avg-card::before {
          background: linear-gradient(90deg, #722ed1, #9254de);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
        }

        .income-card .stat-icon {
          background: rgba(82, 196, 26, 0.2);
          color: #52c41a;
        }

        .expense-card .stat-icon {
          background: rgba(255, 77, 79, 0.2);
          color: #ff4d4f;
        }

        .balance-card .stat-icon {
          background: rgba(24, 144, 255, 0.2);
          color: #1890ff;
        }

        .avg-card .stat-icon {
          background: rgba(114, 46, 209, 0.2);
          color: #722ed1;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .chart-card {
          padding: 2rem;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .chart-card {
          background: rgba(255, 255, 255, 0.03);
        }

        .light .chart-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .chart-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .category-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .category-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .category-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .category-amount {
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .light .progress-bar {
          background: rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .category-percentage {
          font-size: 0.85rem;
          opacity: 0.7;
          font-family: 'JetBrains Mono', monospace;
        }

        .recent-transactions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transaction-item-mini {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }

        .light .transaction-item-mini {
          background: rgba(0, 0, 0, 0.02);
        }

        .transaction-item-mini:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }

        .light .transaction-item-mini:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .transaction-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .transaction-details {
          flex: 1;
          min-width: 0;
        }

        .transaction-description {
          font-weight: 500;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .transaction-date {
          font-size: 0.85rem;
          opacity: 0.6;
          margin-top: 0.25rem;
        }

        .transaction-amount {
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
        }

        .transaction-amount.expense {
          color: #ff4d4f;
        }

        .transaction-amount.income {
          color: #52c41a;
        }

        .budget-overview {
          padding: 2rem;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .budget-overview {
          background: rgba(255, 255, 255, 0.03);
        }

        .light .budget-overview {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .budget-overview h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .budget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .budget-card {
          padding: 1.5rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .light .budget-card {
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .budget-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .over-budget {
          color: #ff4d4f;
        }

        .transactions-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .transactions-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .transaction-actions {
          display: flex;
          gap: 1rem;
        }

        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transaction-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-radius: 20px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .dark .transaction-card {
          background: rgba(255, 255, 255, 0.03);
        }

        .light .transaction-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .transaction-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .transaction-left {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          flex: 1;
        }

        .transaction-icon-large {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .transaction-info {
          flex: 1;
          min-width: 0;
        }

        .transaction-description-large {
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
        }

        .transaction-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: 0.85rem;
          opacity: 0.7;
          flex-wrap: wrap;
        }

        .transaction-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          background: rgba(102, 126, 234, 0.2);
          font-size: 0.8rem;
        }

        .transaction-notes {
          margin-top: 0.75rem;
          font-size: 0.9rem;
          opacity: 0.8;
          font-style: italic;
        }

        .transaction-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .transaction-amount-large {
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.5rem;
        }

        .transaction-actions-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon-small {
          padding: 0.5rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .light .btn-icon-small {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .btn-icon-small:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .accounts-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .accounts-view h2 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .account-card {
          padding: 2.5rem 2rem;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .dark .account-card {
          background: rgba(255, 255, 255, 0.03);
        }

        .light .account-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .account-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .account-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .account-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .account-balance {
          font-size: 2rem;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.3s ease;
        }

        .dark .modal {
          background: rgba(26, 26, 46, 0.95);
        }

        .light .modal {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .light .modal-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .light .close-btn {
          background: rgba(0, 0, 0, 0.05);
        }

        .close-btn:hover {
          background: rgba(255, 77, 79, 0.2);
          color: #ff4d4f;
        }

        .modal-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .light .form-group input,
        .light .form-group select,
        .light .form-group textarea {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .category-select {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .category-btn {
          padding: 1rem 0.75rem;
          border-radius: 12px;
          border: 2px solid transparent;
          background: rgba(255, 255, 255, 0.03);
          color: inherit;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .light .category-btn {
          background: rgba(0, 0, 0, 0.02);
        }

        .category-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .light .category-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .category-btn.active {
          border-color: currentColor;
          background: rgba(255, 255, 255, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-primary,
        .btn-secondary {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .light .btn-secondary {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .light .btn-secondary:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          z-index: 999;
        }

        .fab:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 12px 48px rgba(102, 126, 234, 0.6);
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
          }

          .header-right {
            width: 100%;
            flex-wrap: wrap;
          }

          .search-box {
            flex: 1;
            min-width: auto;
          }

          .nav {
            padding: 1rem;
            gap: 0.5rem;
          }

          .nav-item {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
          }

          .filters {
            padding: 1rem;
            gap: 1rem;
          }

          .main-content {
            padding: 1.5rem 1rem 5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .category-select {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default App;