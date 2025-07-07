import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';

const App: React.FC = () => {
    const token: string | null = localStorage.getItem('token') || sessionStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" replace />} />

                {/* Protected route */}
                <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" replace />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
            </Routes>
        </Router>
    );
};

export default App;
