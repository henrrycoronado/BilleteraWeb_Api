// src/components/dashboard/AddPaymentMethodForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { addPaymentMethod } from '../../api/walletService.js';

export const AddPaymentMethodForm = ({ onSuccess, onCancel }) => {
    const [cardholderName, setCardholderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Simulación de la obtención de un token desde un proveedor externo
    const getPaymentTokenFromGateway = async () => {
        console.log("Simulando comunicación con el proveedor de pagos...");
        await new Promise(res => setTimeout(res, 1000)); // Simular latencia
        
        // Simular diferentes respuestas del proveedor
        if (cardholderName.toLowerCase().includes('error')) return 'token_datos_invalidos';
        if (cardholderName.toLowerCase().includes('rechazo')) return 'token_rechazado_banco';
        
        return 'tok_' + Math.random().toString(36).substring(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        toast.dismiss();

        try {
            const paymentToken = await getPaymentTokenFromGateway();
            const token = localStorage.getItem('authToken');
            
            const response = await addPaymentMethod(token, paymentToken);
            toast.success('¡Método de pago añadido con éxito!');
            onSuccess(response.data.newMethod);

        } catch (error) {
            switch (error.data?.error_code) {
                case 'INVALID_DATA':
                    toast.error('Datos inválidos, verifica e intenta nuevamente.'); // 
                    break;
                case 'PROVIDER_REJECTED':
                    toast.error('El método fue rechazado por el banco emisor.'); // 
                    break;
                case 'METHOD_LIMIT_REACHED':
                    toast.error('Has alcanzado el límite de 3 métodos de pago.'); //
                    break;
                default:
                    toast.error('Ocurrió un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Añadir Nuevo Método de Pago</h2>
            <div>
                <label htmlFor="cardholderName" className="text-sm font-medium text-gray-700">Nombre del Titular</label>
                <input id="cardholderName" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Datos de la Tarjeta</label>
                <div className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Aquí iría el iFrame seguro del proveedor de pagos
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                    {isLoading ? 'Guardando...' : 'Guardar Método'}
                </button>
            </div>
        </form>
    );
};

AddPaymentMethodForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};