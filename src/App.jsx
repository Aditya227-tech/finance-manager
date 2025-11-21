import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { AppShell, LoadingOverlay, Container } from '@mantine/core';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PinLockPage from './pages/PinLockPage';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import AddIncomePage from './pages/AddIncomePage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  return (
    <Router>
        <LoadingOverlay visible={loading} />
        <Routes>
            <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/pin-lock" element={<PinLockPage />} />
            <Route 
                path="/*"
                element={
                    <PrivateRoute>
                        <AppShell
                            navbar={<Navbar user={user} />}
                            padding="md"
                        >
                            <Container fluid>
                                <Routes>
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/add-expense" element={<AddExpensePage />} />
                                    <Route path="/add-income" element={<AddIncomePage />} />
                                    <Route path="/categories" element={<CategoriesPage />} />
                                    <Route path="/budget" element={<BudgetPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                </Routes>
                            </Container>
                        </AppShell>
                    </PrivateRoute>
                }
            />
        </Routes>
    </Router>
  );
}

export default App;
