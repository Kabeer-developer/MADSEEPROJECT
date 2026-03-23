"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
} from "lucide-react";

export default function App() {
  // ---------------- STATE ----------------
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([
    { id: "food", name: "Food", color: "bg-red-400" },
    { id: "transport", name: "Transport", color: "bg-blue-400" },
    { id: "shopping", name: "Shopping", color: "bg-purple-400" },
    { id: "salary", name: "Salary", color: "bg-green-400" },
  ]);

  const [darkMode, setDarkMode] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    customCategory: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // ---------------- STORAGE ----------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tracker"));
    if (data) {
      setTransactions(data.transactions || []);
      setCategories(data.categories || categories);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tracker",
      JSON.stringify({ transactions, categories })
    );
  }, [transactions, categories]);

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  // ---------------- HANDLERS ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.description) return;

    let category = form.category;

    if (form.customCategory) {
      const newCat = {
        id: Date.now().toString(),
        name: form.customCategory,
        color: "bg-gray-400",
      };
      setCategories([...categories, newCat]);
      category = newCat.id;
    }

    const tx = {
      id: editing?.id || Date.now().toString(),
      ...form,
      category,
      amount: parseFloat(form.amount),
    };

    if (editing) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? tx : t))
      );
    } else {
      setTransactions((prev) => [...prev, tx]);
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
      customCategory: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const deleteTx = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const editTx = (tx) => {
    setEditing(tx);
    setForm(tx);
    setShowModal(true);
  };

  const format = (amt) =>
    privacyMode ? "****" : `₹${amt.toLocaleString("en-IN")}`;

  // ---------------- FILTER ----------------
  const filtered = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // ---------------- UI ----------------
  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white"}>
      <div className="max-w-4xl mx-auto p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <div className="flex gap-2">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => setPrivacyMode(!privacyMode)}>
              {privacyMode ? <EyeOff /> : <Eye />}
            </button>
            <button onClick={() => setShowModal(true)}>
              <PlusCircle />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card title="Income" value={format(stats.income)} />
          <Card title="Expense" value={format(stats.expense)} />
          <Card title="Balance" value={format(stats.balance)} />
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-4">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${
                filter === f ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {filtered.length === 0 && <p>No transactions</p>}

          {filtered.map((t) => {
            const cat = categories.find((c) => c.id === t.category);

            return (
              <div
                key={t.id}
                className="flex justify-between items-center p-3 rounded bg-gray-800"
              >
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${cat?.color}`}
                  >
                    {cat?.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={
                      t.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {format(t.amount)}
                  </p>

                  <Edit2 size={16} onClick={() => editTx(t)} />
                  <Trash2 size={16} onClick={() => deleteTx(t.id)} />
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white text-black p-5 rounded w-80 space-y-3"
            >
              <h2 className="font-bold text-lg">
                {editing ? "Edit" : "Add"} Transaction
              </h2>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full border p-2"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <input
                type="number"
                placeholder="Amount"
                className="w-full border p-2"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />

              <select
                className="w-full border p-2"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="New Category"
                className="w-full border p-2"
                value={form.customCategory}
                onChange={(e) =>
                  setForm({ ...form, customCategory: e.target.value })
                }
              />

              <input
                placeholder="Description"
                className="w-full border p-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <div className="flex justify-between">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- CARD ----------------
const Card = ({ title, value }) => (
  <div className="p-4 rounded bg-gray-800 text-center">
    <p className="text-sm">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);