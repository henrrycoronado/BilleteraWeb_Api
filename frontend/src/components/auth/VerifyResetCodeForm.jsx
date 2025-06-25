// src/components/auth/VerifyResetCodeForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

export const VerifyResetCodeForm = ({ onSubmit, isLoading }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ya no llama a la API. Solo pasa el código al componente padre.
        onSubmit(code);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="code" className="text-sm font-medium text-gray-700">Código de Recuperación</label>
                <input id="code" type="text" maxLength={6} value={code}
                    onChange={(e) => setCode(e.target.value)} required
                    className="w-full text-center tracking-[1em] px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button type="submit" disabled={isLoading || code.length !== 6} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isLoading ? '...' : 'Verificar y Continuar'}
            </button>
        </form>
    );
};

VerifyResetCodeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};