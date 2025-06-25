// src/components/auth/RequestResetCodeForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
// ¡Ya no necesita importar el authService ni react-hot-toast!

export const RequestResetCodeForm = ({ onSubmit, isLoading }) => {
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Solo pasa el número de teléfono hacia arriba a su padre.
        onSubmit(phone);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Tu Número de Teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Ingresa tu número registrado"
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                {isLoading ? 'Enviando...' : 'Enviar Código de Recuperación'}
            </button>
        </form>
    );
};

RequestResetCodeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};