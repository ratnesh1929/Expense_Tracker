import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import ExpenseModal from './ExpenseModal';

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpense();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const itemsPerPage = 5;

  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setModalOpen(true);
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">🧾 Expense History</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center">No expenses recorded yet.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedExpenses.map((exp) => (
            <li
              key={exp._id}
              className="bg-white border-l-4 border-indigo-500 p-4 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200"
            >
              <div>
                <p className="text-md font-medium text-gray-800">
                  {exp.category} - <span className="text-indigo-600 font-semibold">₹{exp.amount}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(exp.date).toLocaleDateString()} · {exp.description || 'No description'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-indigo-500 hover:text-indigo-600"
                  aria-label="Edit expense"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="text-red-500 hover:text-red-600 transition"
                  aria-label="Delete expense"
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(expenses.length / itemsPerPage) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </div>
  );
};

export default ExpenseList;
