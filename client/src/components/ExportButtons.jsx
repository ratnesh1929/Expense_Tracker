import React from 'react';
import axios from 'axios';
import { useExpense } from '../context/ExpenseContext';

const ExportButtons = () => {
  const { selectedMonth, token } = useExpense(); // Make sure token is from context

  const handleExport = async (type) => {
    const url = `http://localhost:5000/api/expenses/export${type === 'csv' ? '/csv' : ''}?month=${selectedMonth}`;
    try {
      const res = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token here
          Accept: type === 'csv' ? 'text/csv' : 'application/json',
        },
      });

      const blob = new Blob([res.data], {
        type: type === 'csv' ? 'text/csv' : 'application/json',
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `expenses-${selectedMonth}.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting ${type.toUpperCase()}:`, error);
      alert(`Failed to export ${type.toUpperCase()} file.`);
    }
  };

  return (
    <div className="flex gap-4">
      <button className="btn" onClick={() => handleExport('json')}>Export JSON</button>
      <button className="btn" onClick={() => handleExport('csv')}>Export CSV</button>
    </div>
  );
};

export default ExportButtons;
