// src/components/dashboard/TransactionHistory.jsx
import PropTypes from 'prop-types';
import { TransactionItem } from './TransactionItem';

// Componente para mostrar el esqueleto de carga
const HistorySkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center p-3 bg-gray-100 rounded-md">
                <div className="h-8 w-8 bg-gray-300 rounded-full mr-4"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
        ))}
    </div>
);

export const TransactionHistory = ({ isLoading, error, transactions, onRetry }) => {
    const renderContent = () => {
        if (isLoading) {
            return <HistorySkeleton />;
        }
        
        if (error) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-600">No se pudo cargar el historial.</p>
                    <button onClick={onRetry} className="mt-2 text-sm text-indigo-600 hover:underline">Intentar nuevamente</button>
                </div>
            );
        }

        if (transactions.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron transacciones registradas.</p>
                </div>
            );
        }
        
        return (
            <ul className="space-y-3">
                {transactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </ul>
        );
    };

    return (
        <div className="w-full max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Actividad Reciente</h2>
            {renderContent()}
        </div>
    );
};

TransactionHistory.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    transactions: PropTypes.array.isRequired,
    onRetry: PropTypes.func.isRequired,
};