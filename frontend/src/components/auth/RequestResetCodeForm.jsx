import { useState } from 'react';
import PropTypes from 'prop-types';
import { requestPasswordReset } from '../../api/authService';
import { toast } from 'react-hot-toast';

export const RequestResetCodeForm = ({ onSuccess }) => {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(phone);
            // Siempre mostramos éxito para no revelar información
            toast.success('Si tu número está registrado, recibirás un código.');
            onSuccess(phone);
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error, por favor intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                    id="phone" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isLoading ? 'Enviando...' : 'Enviar Código'}
            </button>
        </form>
    );
};

RequestResetCodeForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
};