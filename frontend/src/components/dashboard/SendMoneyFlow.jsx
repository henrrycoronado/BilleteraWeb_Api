// src/components/dashboard/SendMoneyFlow.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { validateRecipient, sendMoney } from '../../api/walletService.js';
import { formatCurrency } from '../../utils/formatters.js';

// --- Componente del Paso 1: Formulario ---
const SendMoneyForm = ({ onSubmit, isLoading }) => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(phone, parseFloat(amount), description);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <button type="submit" disabled={isLoading} className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                {isLoading ? 'Verificando...' : 'Continuar'}
            </button>
        </form>
    );
};
SendMoneyForm.propTypes = { onSubmit: PropTypes.func.isRequired, isLoading: PropTypes.bool };

// --- Componente del Paso 2: Confirmación ---
// Vistazo aquí: Este es el cuerpo completo y correcto del componente
const SendMoneyConfirmation = ({ details, onConfirm, onCancel, isLoading }) => (
    <div className="space-y-4 text-center">
        <p className="text-gray-600">Vas a enviar:</p>
        <p className="text-4xl font-bold">{formatCurrency(details.amount)}</p>
        <p className="text-gray-600">a:</p>
        <p className="text-xl font-semibold bg-gray-100 p-3 rounded-md">{details.recipientName}</p>
        <div className="flex justify-center space-x-4 pt-4">
            <button onClick={onCancel} disabled={isLoading} className="px-6 py-2 bg-gray-200 rounded-md">Cancelar</button>
            <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 text-white bg-indigo-600 rounded-md">
                {isLoading ? 'Enviando...' : 'Confirmar'}
            </button>
        </div>
    </div>
);
SendMoneyConfirmation.propTypes = {
    details: PropTypes.object,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    isLoading: PropTypes.bool
};

// --- Componente Principal (El Orquestador) ---
export const SendMoneyFlow = ({ onTransferSuccess, onCancel }) => {
    const [step, setStep] = useState('enter_details');
    const [transferDetails, setTransferDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDetailsSubmit = async (phone, amount, description) => {
        setIsLoading(true);
        try {
            const response = await validateRecipient(phone);
            setTransferDetails({ phone, amount, description, recipientName: response.data.recipient.name });
            setStep('confirm');
        } catch (error) {
            toast.error('El número ingresado no está registrado.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmTransfer = async () => {
        setIsLoading(true);
        
        const transferData = {
            recipientPhoneNumber: transferDetails.phone,
            amount: transferDetails.amount,
            description: transferDetails.description,
        };

        sendMoney(transferData)
            .then(response => {
                console.log("Transferencia exitosa:", response.data);
                toast.success('¡Transferencia realizada con éxito!');
                setStep('success');
                onTransferSuccess();
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo realizar la transferencia.');
                setStep('enter_details');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    
    if (step === 'success') {
        return (
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-600">¡Éxito!</h2>
                <p>Tu transferencia a <span className="font-semibold">{transferDetails.recipientName}</span> se completó.</p>
                <button onClick={onCancel} className="w-full mt-4 py-2 text-white bg-indigo-600 rounded-md">Cerrar</button>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-xl font-bold text-center mb-6">Enviar Dinero</h2>
            {step === 'enter_details' && <SendMoneyForm onSubmit={handleDetailsSubmit} isLoading={isLoading} />}
            {step === 'confirm' && (
                <SendMoneyConfirmation 
                    details={transferDetails}
                    onConfirm={handleConfirmTransfer}
                    onCancel={() => setStep('enter_details')}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

SendMoneyFlow.propTypes = {
    onTransferSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};