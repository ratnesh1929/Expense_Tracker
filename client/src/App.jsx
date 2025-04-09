import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useExpense } from './context/ExpenseContext';

// Reusable PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user } = useExpense();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user } = useExpense();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
