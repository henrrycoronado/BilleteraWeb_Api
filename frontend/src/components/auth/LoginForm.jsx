// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

export const LoginForm = ({ onSubmit, isLoading }) => {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // El formulario ya no llama a la API.
        // Solo avisa a su padre pasándole los datos.
        onSubmit(phone, pin);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="pin" className="text-sm font-medium text-gray-700">PIN de Seguridad</label>
                <input
                    id="pin"
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};