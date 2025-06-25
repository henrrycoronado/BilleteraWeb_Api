// src/App.jsx
import { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

const WelcomePage = ({ showLogin, showRegister }) => (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido a tu Billetera</h1>
            <p className="text-gray-600">La forma más fácil de manejar tu dinero.</p>
            <div className="flex flex-col space-y-4 pt-4">
                <button onClick={showLogin} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Iniciar Sesión
                </button>
                <button onClick={showRegister} className="w-full py-2 px-4 text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                    Crear Cuenta Nueva
                </button>
            </div>
        </div>
    </div>
);

function App() {
    const [view, setView] = useState('welcome');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };
  
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setView('welcome');
    };

    if (isAuthenticated) {
        return <DashboardPage onLogout={handleLogout} />;
    }

    switch (view) {
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} showWelcome={() => setView('welcome')} showForgotPassword={() => setView('forgot_password')} />;
        case 'register':
            return <RegistrationPage showLogin={() => setView('login')} />;
        case 'forgot_password':
            return <ForgotPasswordPage showLogin={() => setView('login')} />;
        default:
            return <WelcomePage showLogin={() => setView('login')} showRegister={() => setView('register')} />;
    }
}

export default App;