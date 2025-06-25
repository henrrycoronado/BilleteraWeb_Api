import { useState } from 'react';
import PropTypes from 'prop-types';
import { verifyResetCode } from '../../api/authService';
import { toast } from 'react-hot-toast';

export const VerifyResetCodeForm = ({ phone, onSuccess }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verifyResetCode(phone, code);
            toast.success('Código verificado.');
            onSuccess();
        } catch (error) {
            toast.error('Código inválido o expirado. Intenta de nuevo.'); // Flujo A2 
        } finally {
            setIsLoading(false);
        }
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
            <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isLoading ? 'Verificando...' : 'Verificar'}
            </button>
        </form>
    );
};

VerifyResetCodeForm.propTypes = {
    phone: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
};