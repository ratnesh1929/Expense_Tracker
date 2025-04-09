import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { useExpense } from '../context/ExpenseContext';

const SummaryChart = () => {
  const { summary, fetchSummary } = useExpense();
  const chartRef = useRef(null);

  useEffect(() => {
    fetchSummary();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    labels: summary.map((s) => s._id),
    datasets: [
      {
        label: 'Total Spent',
        data: summary.map((s) => s.total),
        backgroundColor: '#6366F1',
        borderRadius: 10,
        borderSkipped: false,
        hoverBackgroundColor: '#4338ca',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`,
        },
        backgroundColor: '#4f46e5',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        padding: 12,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280',
          font: {
            weight: '500',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#6b7280',
          callback: (value) => `₹${value}`,
          font: {
            weight: '500',
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="bg-white border border-indigo-200 p-6 rounded-3xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-100 pb-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-indigo-700 tracking-wide">
            Expense Summary
          </h2>
        </div>
      </div>
      <div className="h-[300px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default SummaryChart;
