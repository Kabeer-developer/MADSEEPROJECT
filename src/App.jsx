"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  PlusCircle,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Calendar,
  Users,
  Zap,
  Star,
  Award,
  Download,
  Upload,
  Settings,
  X,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ClaudeSonetExpenseTracker() {
  // ---------------- EXTENDED STATE ----------------
  const defaultCategories = [
    { id: "food", name: "🍔 Food & Dining", color: "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg" },
    { id: "transport", name: "🚗 Transport", color: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg" },
    { id: "shopping", name: "🛍️ Shopping", color: "bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-lg" },
    { id: "bills", name: "💡 Bills & Utilities", color: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg" },
    { id: "health", name: "🏥 Health & Medical", color: "bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg" },
    { id: "entertainment", name: "🎬 Entertainment", color: "bg-gradient-to-r from-indigo-400 to-blue-500 text-white shadow-lg" },
    { id: "education", name: "📚 Education", color: "bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-lg" },
    { id: "salary", name: "💼 Salary", color: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg" },
    { id: "freelance", name: "💻 Freelance", color: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg" },
    { id: "investment", name: "📈 Investments", color: "bg-gradient-to-r from-lime-400 to-green-500 text-white shadow-lg" },
    { id: "gifts", name: "🎁 Gifts", color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg" },
    { id: "travel", name: "✈️ Travel", color: "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg" },
    { id: "rent", name: "🏠 Rent", color: "bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-lg" },
    { id: "insurance", name: "🛡️ Insurance", color: "bg-gradient-to-r from-fuchsia-400 to-purple-500 text-white shadow-lg" },
    { id: "custom", name: "✨ Custom Category", color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg" },
  ];

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [darkMode, setDarkMode] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCharts, setShowCharts] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    receipt: null,
    isRecurring: false,
    recurrence: "monthly",
  });

  const fileInputRef = useRef(null);

  // ---------------- ENHANCED STORAGE ----------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("claudeSonetTracker"));
    if (data) {
      setTransactions(data.transactions || []);
      setCategories(data.categories || defaultCategories);
      setRecurringTransactions(data.recurring || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "claudeSonetTracker",
      JSON.stringify({ transactions, categories, recurringTransactions })
    );
  }, [transactions, categories, recurringTransactions]);

  // ---------------- ADVANCED STATS ----------------
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const balance = income - expense;

    const categoryStats = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        const cat = categories.find(c => c.id === t.category);
        categoryStats[cat?.name || 'Other'] = (categoryStats[cat?.name || 'Other'] || 0) + t.amount;
      }
    });

    return { income, expense, balance, categoryStats };
  }, [transactions, categories]);

  // ---------------- CHART DATA ----------------
  const chartData = useMemo(() => {
    const labels = Object.keys(stats.categoryStats);
    const data = Object.values(stats.categoryStats);

    return {
      labels,
      datasets: [{
        label: 'Expenses by Category',
        data,
        backgroundColor: categories.map(c => c.color.replace('text-white shadow-lg', 'shadow-lg')).slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff20',
      }]
    };
  }, [stats.categoryStats, categories]);

  const monthlyData = useMemo(() => {
    const monthly = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthly[month] = (monthly[month] || 0) + (t.type === 'expense' ? t.amount : -t.amount);
    });

    return {
      labels: Object.keys(monthly),
      datasets: [{
        label: 'Net Spending',
        data: Object.values(monthly),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      }]
    };
  }, [transactions]);

  // ---------------- ENHANCED SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;

    let category = form.category;
    
    // 🔥 Custom category with input field (NO prompt)
    if (form.category === "custom" && customCategory) {
      const existingCat = categories.find(c => c.name.toLowerCase() === customCategory.toLowerCase());
      if (existingCat) {
        category = existingCat.id;
      } else {
        const newCat = {
          id: `custom_${Date.now()}`,
          name: customCategory,
          color: `bg-gradient-to-r from-gray-${Math.floor(Math.random() * 400 + 300)} to-gray-${Math.floor(Math.random() * 400 + 400)} text-white shadow-lg`,
        };
        setCategories(prev => [...prev, newCat]);
        category = newCat.id;
      }
      setCustomCategory("");
    }

    const tx = {
      id: editing?.id || Date.now().toString(),
      ...form,
      category,
      amount: parseFloat(form.amount),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (editing) {
      setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    } else {
      setTransactions(prev => [...prev, tx]);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
      receipt: null,
      isRecurring: false,
      recurrence: "monthly",
    });
    setCustomCategory("");
  };

  const deleteTx = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const editTx = (tx) => {
    setEditing(tx);
    setForm({
      ...tx,
      tags: tx.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const format = (amt) => privacyMode ? "****" : `₹${amt.toLocaleString("en-IN")}`;

  // ---------------- FILTER & SORT ----------------
  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesFilter = filter === "all" || t.type === filter;
        const matchesTime = timeRange === "all" || 
          (timeRange === "thisMonth" && new Date(t.date).getMonth() === new Date().getMonth()) ||
          (timeRange === "lastMonth" && new Date(t.date).getMonth() === new Date().getMonth() - 1);
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesTime && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        if (sortBy === "amount") return b.amount - a.amount;
        if (sortBy === "description") return a.description.localeCompare(b.description);
        return 0;
      });
  }, [transactions, filter, timeRange, search, sortBy]);

  // ---------------- UI ----------------
  return (
    <div className={`${darkMode ? 'dark bg-gradient-to-br from-gray-950 via-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} min-h-screen text-white transition-all duration-500`}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* 🔥 CLAUDE SONET 4.6 HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Expense Tracker
            </h1>
            <p className="text-xl opacity-80 font-semibold">🚀 Ultimate Expense Intelligence Tracker</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all shadow-xl hover:scale-105">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setPrivacyMode(!privacyMode)} className="p-3 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all shadow-xl hover:scale-105">
              {privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 transition-all font-semibold">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🔥 ADVANCED SEARCH & CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20">
              <Search className="w-5 h-5 opacity-70" />
              <input
                placeholder="🔍 Search transactions, tags, descriptions..."
                className="bg-transparent outline-none w-full text-lg placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-sm w-full"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
        </div>

        {/* 🔥 PREMIUM STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="💰 Total Income" 
            value={format(stats.income)} 
            trend="+12.5%"
            icon={<DollarSign className="w-8 h-8" />}
            color="from-emerald-500 to-teal-500"
          />
          <StatsCard 
            title="📉 Total Expense" 
            value={format(stats.expense)} 
            trend="-8.2%"
            icon={<TrendingDown className="w-8 h-8" />}
            color="from-red-500 to-pink-500"
          />
          <StatsCard 
            title="💎 Balance" 
            value={format(stats.balance)} 
            trend="+24.1%"
            icon={<TrendingUp className="w-8 h-8" />}
            color="from-blue-500 to-purple-500"
          />
          <StatsCard 
            title="📊 Transactions" 
            value={transactions.length.toLocaleString()} 
            trend="+5"
            icon={<PieChart className="w-8 h-8" />}
            color="from-indigo-500 to-violet-500"
          />
        </div>

        {/* 🔥 FILTER & SORT */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                filter === f 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 scale-105" 
                  : "bg-white/10 hover:bg-white/20 hover:scale-105"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent px-4 py-3 rounded-2xl border border-white/30 font-semibold outline-none"
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
            <option value="description">Sort: Description</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🔥 TRANSACTIONS LIST */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                📋 Recent Transactions
              </h2>
              <button 
                onClick={() => setShowCharts(!showCharts)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:scale-105 transition-all shadow-lg"
              >
                {showCharts ? <BarChart3 size={18} /> : <PieChart size={18} />}
                Charts
              </button>
            </div>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {filtered.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <PieChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-xl">No transactions found</p>
                </div>
              ) : (
                filtered.map((t) => {
                  const cat = categories.find((c) => c.id === t.category);
                  return (
                    <TransactionCard
                      key={t.id}
                      transaction={t}
                      category={cat}
                      privacyMode={privacyMode}
                      onEdit={() => editTx(t)}
                      onDelete={() => deleteTx(t.id)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* 🔥 BEAUTIFUL GRAPHS */}
          {showCharts && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
                              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6" />
                Expenses by Category
              </h3>
                <div className="h-80">
                  <Pie data={chartData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          color: darkMode ? '#ffffff' : '#1f2937'
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                      }
                    }
                  }} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Monthly Trends
                </h3>
                <div className="h-64">
                  <Bar data={monthlyData} options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                          color: darkMode ? '#ffffff' : '#1f2937'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                          color: darkMode ? '#ffffff' : '#1f2937'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: darkMode ? '#ffffff' : '#1f2937'
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 🔥 CLAUDE SONET MODAL - PROFESSIONAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {editing ? "✏️ Edit" : "➕ Add"} Transaction
                  </h2>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Selector */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center p-4 rounded-2xl cursor-pointer transition-all group hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-white/30">
                        <input
                          type="radio"
                          value="expense"
                          checked={form.type === "expense"}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          className="sr-only"
                        />
                        <TrendingDown className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-lg">Expense</div>
                          <div className="text-sm opacity-75">Spending money</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 rounded-2xl cursor-pointer transition-all group hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-white/30">
                        <input
                          type="radio"
                          value="income"
                          checked={form.type === "income"}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          className="sr-only"
                        />
                        <TrendingUp className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-lg">Income</div>
                          <div className="text-sm opacity-75">Earning money</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-lg font-semibold focus:outline-none focus:border-blue-400 transition-all"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* 🔥 CUSTOM CATEGORY DROPDOWN + INPUT */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Category</label>
                    <div className="space-y-2">
                      <select
                        className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-lg focus:outline-none focus:border-blue-400 transition-all"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                      >
                        <option value="">🎯 Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      
                      {form.category === "custom" && (
                        <input
                          type="text"
                          placeholder="✨ Type your custom category name..."
                          className="w-full p-4 bg-white/20 backdrop-blur-xl border-2 border-dashed border-white/30 rounded-2xl text-lg focus:outline-none focus:border-emerald-400 transition-all"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 opacity-90">Description</label>
                      <input
                        placeholder="What did you spend on?"
                        className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 transition-all"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 opacity-90">Tags (comma separated)</label>
                      <input
                        placeholder="e.g. online, urgent, work"
                        className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 transition-all"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 opacity-90">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                      <input
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:border-green-400 transition-all"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 p-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      {editing ? "Update" : "Add"} Transaction
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 p-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-gray-500/25 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 ENHANCED COMPONENTS
const StatsCard = ({ title, value, trend, icon, color }) => (
  <div className="group p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-2xl hover:shadow-blue-500/25 cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}>{icon}</div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border`}>
        {trend}
      </div>
    </div>
    <h3 className="text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{value}</h3>
    <p className="text-sm opacity-75">{title}</p>
  </div>
);

const TransactionCard = ({ transaction, category, privacyMode, onEdit, onDelete }) => {
  const format = (amt) => privacyMode ? "****" : `₹${amt.toLocaleString("en-IN")}`;
  
  return (
    <div className="group flex justify-between items-center p-6 rounded-3xl bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all hover:scale-[1.02] hover:rotate-1 duration-300">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${category?.color}`}>
          <span className="font-bold text-sm">{category?.name.split(' ')[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xl group-hover:text-blue-300 transition-colors truncate">{transaction.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {transaction.tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-purple-500/30">
                #{tag}
              </span>
            ))}
            {transaction.tags?.length > 2 && (
              <span className="px-3 py-1 bg-gray-500/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                +{transaction.tags.length - 2}
              </span>
            )}
          </div>
          <p className="text-sm opacity-75 mt-1">{new Date(transaction.date).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className={`px-4 py-2 rounded-2xl font-bold text-lg shadow-lg ${
          transaction.type === "income"
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
        }`}>
          {format(transaction.amount)}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={onEdit} className="p-2 hover:bg-blue-500/20 rounded-xl transition-all hover:rotate-180">
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-red-500/20 rounded-xl transition-all hover:rotate-90">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};