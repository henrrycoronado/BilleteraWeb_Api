// src/components/auth/CreatePinForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

export const CreatePinForm = ({ onSubmit, isLoading }) => {
    const [pins, setPins] = useState({
        newPin: '',
        confirmNewPin: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPins(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validación local antes de enviar
        if (pins.newPin !== pins.confirmNewPin) {
            toast.error('Los PIN no coinciden.');
            return;
        }
        if (pins.newPin.length !== 6) {
            toast.error('El PIN debe tener 6 dígitos.');
            return;
        }

        // 2. Pasa el PIN validado al padre para que él haga la llamada a la API
        onSubmit(pins.newPin);
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-bold">Crea tu PIN de seguridad</h1>
                <p className="text-gray-500">Lo usarás para iniciar sesión y confirmar operaciones.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newPin" className="text-sm font-medium text-gray-700">PIN de 6 dígitos</label>
                    <input id="newPin" name="newPin" type="password" maxLength={6} required
                        className="w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 mt-1 border rounded-md"
                        value={pins.newPin} onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPin" className="text-sm font-medium text-gray-700">Confirma tu PIN</label>
                    <input id="confirmNewPin" name="confirmNewPin" type="password" maxLength={6} required
                        className="w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 mt-1 border rounded-md"
                        value={pins.confirmNewPin} onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={isLoading}
                    className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {isLoading ? 'Finalizando...' : 'Crear Cuenta'}
                </button>
            </form>
        </>
    );
};

CreatePinForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};