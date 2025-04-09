import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { PlusCircleIcon } from 'lucide-react';

const ExpenseForm = () => {
  const { addExpense, editingExpense, updateExpense } = useExpense();
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: today, // Set default date to today
    description: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(form.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense._id, form);
    } else {
      addExpense(form);
    }
    setForm({ amount: '', category: '', date: today, description: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md mb-8 space-y-4"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          name="amount"
          type="number"
          placeholder="💰 Enter amount"
          value={form.amount}
          onChange={handleChange}
          className="input-style w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          name="category"
          type="text"
          placeholder="📂 Enter category"
          value={form.category}
          onChange={handleChange}
          className="input-style w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="input-style w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          name="description"
          type="text"
          placeholder="📝 Enter description (optional)"
          value={form.description}
          onChange={handleChange}
          className="input-style w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
      >
        <PlusCircleIcon className="w-5 h-5" />
        {editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
