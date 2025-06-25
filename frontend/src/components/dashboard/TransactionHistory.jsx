// src/components/dashboard/TransactionHistory.jsx
import PropTypes from 'prop-types';
import { TransactionItem } from './TransactionItem';

const HistorySkeleton = () => { /* ... (código sin cambios) ... */ };

export const TransactionHistory = ({ isLoading, error, transactions, onRetry, currentWallet }) => {
    const renderContent = () => {
        if (isLoading) return <HistorySkeleton />;
        if (error) { /* ... (código sin cambios) ... */ }
        if (transactions.length === 0) { /* ... (código sin cambios) ... */ }
        
        return (
            <ul className="space-y-3">
                {transactions.map(tx => (
                    // Vistazo aquí: Pasamos la prop 'currentWallet' al item
                    <TransactionItem key={tx.id} transaction={tx} currentWallet={currentWallet} />
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
    currentWallet: PropTypes.object, // Nueva prop
};