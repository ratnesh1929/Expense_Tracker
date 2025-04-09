import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/API'; 

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  });
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (token && selectedMonth) {
      fetchExpenses();
      fetchSummary();
    }
  }, [selectedMonth, token]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses?month=${selectedMonth}`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const addExpense = async (expense) => {
    try {
      const res = await API.post('/expenses', expense);
      setExpenses((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await API.get(`/expenses/summary?month=${selectedMonth}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setSummary([]);
    }
  };

  const updateExpense = async (id, expense) => {
    try {
      await API.put(`/expenses/${id}`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const login = ({ token, user }) => {
    console.log('Setting token and user in context:', user); // 🧠
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        selectedMonth,
        setSelectedMonth,
        fetchExpenses,
        addExpense,
        deleteExpense,
        fetchSummary,
        login,
        logout,
        token,
        user,
        editingExpense,
        setEditingExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
