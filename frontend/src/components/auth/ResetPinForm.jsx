// src/components/auth/ResetPinForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

export const ResetPinForm = ({ onSubmit, isLoading }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (pin !== confirmPin) {
            toast.error('Los PIN no coinciden.');
            return;
        }
        if (pin.length !== 6) {
            toast.error('El nuevo PIN debe tener 6 dígitos.');
            return;
        }

        // Pasa el nuevo PIN al componente padre.
        onSubmit(pin);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="pin" className="text-sm font-medium text-gray-700">Nuevo PIN de 6 dígitos</label>
                <input id="pin" type="password" maxLength={6} value={pin}
                    onChange={(e) => setPin(e.target.value)} required
                    className="w-full text-center tracking-[1em] px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label htmlFor="confirmPin" className="text-sm font-medium text-gray-700">Confirmar nuevo PIN</label>
                <input id="confirmPin" type="password" maxLength={6} value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)} required
                    className="w-full text-center tracking-[1em] px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                {isLoading ? 'Actualizando...' : 'Guardar Nuevo PIN'}
            </button>
        </form>
    );
};

ResetPinForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};