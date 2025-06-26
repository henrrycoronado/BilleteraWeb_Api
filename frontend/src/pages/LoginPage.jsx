import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast';

import { AuthServices } from '../api/authService.js';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = ({ onLoginSuccess, showWelcome, showForgotPassword }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = async (phone, pin) => {
        if (!phone || !pin) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        toast.dismiss();
        const input = {
            phoneNumber: phone.trim(),
            pin: pin.trim(),
        }
        AuthServices.login(input)
            .then(response => {
                console.log("Respuesta del backend:", response.data);
                const token = response.data.token;
                localStorage.setItem('authToken', token);
                toast.success(response.data.message || '¡Bienvenido de nuevo!');
                onLoginSuccess(token);
            })
            .catch(error => {
                console.error("Error en el login:", error.response);
                const errorMessage = error.response?.data?.message || 'Ocurrió un error. Inténtalo de nuevo.';
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                    <p className="text-gray-500">Ingresa a tu billetera móvil.</p>
                </div>
                
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