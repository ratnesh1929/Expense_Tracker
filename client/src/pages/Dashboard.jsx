import { useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import SummaryChart from "../components/SummaryChart";
import ExportButtons from '../components/ExportButtons';

const Dashboard = () => {
  const { user, logout } = useExpense();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-md px-6 py-4 animate-fade-in">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-300 px-4 py-2 rounded-lg font-medium shadow-sm"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg animate-fade-in">
        <ExpenseForm />
      </div>

      {/* Chart */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg animate-fade-in">
        <SummaryChart />
      </div>

      {/* List */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg animate-fade-in">
        <ExpenseList />
      </div>

      {/* Export Buttons */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg animate-fade-in">
        <ExportButtons />
      </div>
    </div>
  );
};

export default Dashboard;
