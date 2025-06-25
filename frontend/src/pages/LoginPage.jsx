// src/pages/LoginPage.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast';

import { login } from '../api/authService.js'; // <-- Importa el servicio
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = ({ onLoginSuccess, showWelcome, showForgotPassword }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Esta es la función "cerebro" que maneja la lógica del login
    const handleLoginSubmit = async (phone, pin) => {
        // Validación rápida de campos vacíos
        if (!phone || !pin) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        toast.dismiss();

        try {
            const response = await login(phone, pin);
            toast.success('¡Bienvenido de nuevo!');
            // Llama a la función del padre (App.jsx) para cambiar de vista
            onLoginSuccess(response.data.token);
        } catch (error) {
            // Maneja los errores específicos de la API aquí
            switch (error.data?.error_code) {
                case 'INVALID_CREDENTIALS':
                    toast.error('Número o PIN incorrectos.');
                    break;
                case 'ACCOUNT_LOCKED':
                    toast.error('Demasiados intentos. Tu cuenta está bloqueada temporalmente.');
                    break;
                default:
                    toast.error('Ocurrió un error. Inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                    <p className="text-gray-500">Ingresa a tu billetera móvil.</p>
                </div>
                
                {/* El "cerebro" le pasa su lógica y estado al "brazo" */}
                <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

                <div className="flex justify-between items-center text-sm pt-2">
                    <p className="text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <button onClick={showWelcome} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Regístrate
                        </button>
                    </p>
                    <button onClick={showForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500">
                        ¿Olvidaste tu PIN?
                    </button>
                </div>
            </div>
        </div>
    );
};

LoginPage.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
    showWelcome: PropTypes.func.isRequired,
    showForgotPassword: PropTypes.func.isRequired,
};