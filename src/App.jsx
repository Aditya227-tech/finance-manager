import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PinLockPage from './pages/PinLockPage';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import AddIncomePage from './pages/AddIncomePage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/pin-lock" element={<PinLockPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/add-expense" element={user ? <AddExpensePage /> : <Navigate to="/" />} />
        <Route path="/add-income" element={user ? <AddIncomePage /> : <Navigate to="/" />} />
        <Route path="/categories" element={user ? <CategoriesPage /> : <Navigate to="/" />} />
        <Route path="/budget" element={user ? <BudgetPage /> : <Navigate to="/" />} />
        <Route path="/reports" element={user ? <ReportsPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
