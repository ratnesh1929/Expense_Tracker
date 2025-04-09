import React from 'react';
import { XIcon } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = ({ isOpen, onClose, expense }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Expense</h2>
          <ExpenseForm isEditing={true} initialData={expense} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
