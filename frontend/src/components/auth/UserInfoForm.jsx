// src/components/auth/UserInfoForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

export const UserInfoForm = ({ onSubmit, onSwitchToLogin, isLoading }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // El DTO pide FullName, pero podemos unirlo antes de enviarlo
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, lastName, phoneNumber, email } = formData;
        // Unimos nombre y apellido para que coincida con el DTO
        const fullName = `${name} ${lastName}`.trim();
        onSubmit({ fullName, phoneNumber, email });
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-bold">Crear tu cuenta</h1>
                <p className="text-gray-500">Ingresa tus datos para comenzar.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                        <input id="name" name="name" type="text" required className="w-full px-3 py-2 mt-1 border rounded-md" onChange={handleChange} value={formData.name} />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Apellido</label>
                        <input id="lastName" name="lastName" type="text" required className="w-full px-3 py-2 mt-1 border rounded-md" onChange={handleChange} value={formData.lastName} />
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Número de Teléfono</label>
                    <input id="phoneNumber" name="phoneNumber" type="tel" required className="w-full px-3 py-2 mt-1 border rounded-md" onChange={handleChange} value={formData.phoneNumber} />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico (Opcional)</label>
                    <input id="email" name="email" type="email" className="w-full px-3 py-2 mt-1 border rounded-md" onChange={handleChange} value={formData.email} />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isLoading ? 'Verificando...' : 'Continuar'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Inicia sesión
                </button>
            </p>
        </>
    );
};

UserInfoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onSwitchToLogin: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};