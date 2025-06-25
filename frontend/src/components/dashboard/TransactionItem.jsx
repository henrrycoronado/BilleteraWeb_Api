// src/components/dashboard/TransactionItem.jsx
import PropTypes from 'prop-types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const TransactionItem = ({ transaction, currentWallet }) => {
    // Vistazo aquí: La nueva lógica para determinar si la transacción es enviada.
    // Asumimos que tanto transaction como currentWallet tienen un objeto con un 'id'.
    const isSent = transaction.sourceWallet?.id === currentWallet?.id;
    
    const formattedDate = new Date(transaction.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    // Para mostrar el nombre del contacto en la descripción
    const contactName = isSent 
        ? transaction.destinationWallet?.user?.fullName 
        : transaction.sourceWallet?.user?.fullName;
    
    const description = transaction.description || `Transferencia ${isSent ? 'a' : 'de'} ${contactName || 'Desconocido'}`;

    return (
        <li className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isSent ? 'bg-red-100' : 'bg-green-100'}`}>
                {isSent 
                    ? <ArrowUpRight className="w-5 h-5 text-red-600" /> 
                    : <ArrowDownLeft className="w-5 h-5 text-green-600" />
                }
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{description}</p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            <p className={`font-semibold text-lg ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                {isSent ? '-' : '+'}
                {formatCurrency(transaction.amount)}
            </p>
        </li>
    );
};

TransactionItem.propTypes = {
    transaction: PropTypes.object.isRequired,
    // Le pasaremos los datos de la billetera actual para la comparación
    currentWallet: PropTypes.object,
};