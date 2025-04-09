import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CalendarIcon } from 'lucide-react'; // Optional: If you're using lucide-react for icons

const Filters = () => {
  const { selectedMonth, setSelectedMonth } = useExpense();

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4 bg-white px-4 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
      <label htmlFor="month" className="text-gray-700 font-medium flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-indigo-500" />
        Filter by Month:
      </label>
      <input
        id="month"
        type="month"
        value={selectedMonth}
        onChange={handleChange}
        className="transition-all w-full sm:w-[200px] border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-50 hover:bg-indigo-100"
      />
    </div>
  );
};

export default Filters;
