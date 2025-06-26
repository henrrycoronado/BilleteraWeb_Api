import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { UserServices } from '../../api/userServices.js';

export const SendMoneyFlow = ({ onTransferSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const transferData = {
            recipientPhoneNumber: phone,
            amount: parseFloat(amount),
            description: description,
        };

        UserServices.sendMoney(transferData)
            .then(response => {
                console.log("Transferencia exitosa:", response.data);
                toast.success('¡Transferencia realizada con éxito!');
                setIsSuccess(true);
                onTransferSuccess();
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo realizar la transferencia.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    
    if (isSuccess) {
        return (
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-600">¡Transferencia Enviada!</h2>
                <p>Tu transferencia se ha procesado correctamente.</p>
                <button onClick={onCancel} className="w-full mt-4 py-2 text-white bg-indigo-600 rounded-md">Cerrar</button>
            </div>
        );
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">Enviar Dinero</h2>
            <div>
                <label htmlFor="phone" className="text-sm font-medium">Número de Teléfono del Destinatario</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
                <label htmlFor="amount" className="text-sm font-medium">Monto a Enviar (Bs.)</label>
                <input id="amount" type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
                <label htmlFor="description" className="text-sm font-medium">Descripción (Opcional)</label>
                <input id="description" type="text" maxLength="100" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
        </form>
    );
};

SendMoneyFlow.propTypes = {
    onTransferSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};